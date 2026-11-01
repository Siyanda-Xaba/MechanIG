import os
import subprocess
import tempfile
import librosa
import numpy as np

# Keep audio configuration in one place so preprocessing, training,
# prediction, and mobile API all agree on exact numbers.
try:
    from .config import (
        EXPECTED_MEL_SHAPE,
        HOP_LENGTH,
        MIN_ENERGY_THRESHOLD,
        N_FFT,
        N_MELS,
        TARGET_SAMPLE_RATE,
        TARGET_SAMPLES,
        WINDOW_STEP_SAMPLES,
    )
except ImportError:
    from config import (
        EXPECTED_MEL_SHAPE,
        HOP_LENGTH,
        MIN_ENERGY_THRESHOLD,
        N_FFT,
        N_MELS,
        TARGET_SAMPLE_RATE,
        TARGET_SAMPLES,
        WINDOW_STEP_SAMPLES,
    )


def _load_audio_file(audio_path, sr=TARGET_SAMPLE_RATE, mono=True):
    """Load audio with librosa, falling back to ffmpeg conversion for containers like .m4a."""
    try:
        return librosa.load(audio_path, sr=sr, mono=mono)
    except Exception:
        try:
            import imageio_ffmpeg
            ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        except Exception:
            ffmpeg_exe = "ffmpeg"

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_wav:
            tmp_wav_path = tmp_wav.name

        try:
            cmd = [
                ffmpeg_exe, "-y", "-i", str(audio_path),
                "-ar", str(sr), "-ac", "1" if mono else "2",
                "-f", "wav", tmp_wav_path
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            return librosa.load(tmp_wav_path, sr=sr, mono=mono)
        finally:
            if os.path.exists(tmp_wav_path):
                try:
                    os.remove(tmp_wav_path)
                except OSError:
                    pass



def check_audio_energy(audio, min_energy=MIN_ENERGY_THRESHOLD):
    """Check if the audio signal is audible or silent by calculating Root-Mean-Square (RMS) energy.
    
    Returns:
        is_audible (bool): True if signal has enough volume to diagnose.
        rms (float): The calculated average volume level.
    """
    if len(audio) == 0:
        return False, 0.0

    # RMS calculates the average energy/amplitude of the sound wave.
    rms = float(np.sqrt(np.mean(np.square(audio))))
    return (rms >= min_energy), rms


def load_standardised_audio(audio_path):
    """Load audio as mono, resample it to 22050 Hz, then trim or pad it to 5 seconds.
    
    Used during initial dataset standardisation.
    """
    # librosa resamples the recording and mixes multi-channel stereo down to mono.
    audio, _ = _load_audio_file(audio_path, sr=TARGET_SAMPLE_RATE, mono=True)
    audio = _trim_silence_edges(audio)

    # Standardise length to exactly 5 seconds (110,250 samples).
    if len(audio) > TARGET_SAMPLES:
        # A recording may start with silence or a quiet lead-in. Use the loudest
        # overlapping analysis window instead of assuming the first five seconds
        # contain the labelled sound.
        starts = list(range(0, len(audio) - TARGET_SAMPLES + 1, WINDOW_STEP_SAMPLES))
        last_start = len(audio) - TARGET_SAMPLES
        if not starts or starts[-1] != last_start:
            starts.append(last_start)
        audio = max(
            (audio[start : start + TARGET_SAMPLES] for start in starts),
            key=lambda window: float(np.sqrt(np.mean(np.square(window)))),
        )
    elif len(audio) < TARGET_SAMPLES:
        audio = librosa.util.fix_length(audio, size=TARGET_SAMPLES)

    return audio


def load_audio_windows(audio_path):
    """Load an audio recording of ANY length and extract overlapping 5-second analysis windows.
    
    Instead of throwing away sound after 5 seconds, this function slides a 5-second
    window across the full recording so sounds occurring anywhere in the clip are captured.

    Returns:
        windows (list of np.ndarray): Each array has exactly 110,250 samples (5s @ 22050 Hz).
        total_duration (float): Length of the original recording in seconds.
        is_audible (bool): Whether the recording contains enough volume.
        rms (float): The measured audio RMS volume level.
    """
    # Load the whole recording at 22050 Hz mono.
    audio, sr = _load_audio_file(audio_path, sr=TARGET_SAMPLE_RATE, mono=True)
    total_samples = len(audio)
    total_duration = float(total_samples / TARGET_SAMPLE_RATE) if TARGET_SAMPLE_RATE else 0.0

    # Ignore silence before/after the sound while keeping duration from the full file.
    audio = _trim_silence_edges(audio)
    total_samples = len(audio)

    # Check the trimmed signal so a quiet lead-in does not hide a clear sound later.
    is_audible, rms = check_audio_energy(audio)

    # Case 1: Short clip (less than or equal to 5 seconds).
    # Pad it with silence so the CNN receives its expected 5-second shape.
    if total_samples <= TARGET_SAMPLES:
        padded = librosa.util.fix_length(audio, size=TARGET_SAMPLES)
        return ([padded] if is_audible else []), total_duration, is_audible, rms

    # Case 2: Longer clip.
    # Slide a 5-second window forward by 2.5 seconds (50% overlap).
    windows = []
    start = 0

    while start + TARGET_SAMPLES <= total_samples:
        window = audio[start : start + TARGET_SAMPLES]
        windows.append(window)
        start += WINDOW_STEP_SAMPLES

    # If there is a leftover tail at the end longer than 1.5 seconds,
    # pad it to 5 seconds and include it so the end of the recording is not missed.
    remainder = audio[start:]
    if len(remainder) >= int(TARGET_SAMPLE_RATE * 1.5):
        padded_remainder = librosa.util.fix_length(remainder, size=TARGET_SAMPLES)
        windows.append(padded_remainder)

    # In case no window was captured (e.g. edge case), fallback to the first 5 seconds padded.
    if not windows:
        windows.append(librosa.util.fix_length(audio[:TARGET_SAMPLES], size=TARGET_SAMPLES))

    # Silent windows do not contain a diagnosis and can distort an averaged score.
    audible_windows = [window for window in windows if check_audio_energy(window)[0]]
    is_audible = bool(audible_windows)
    return audible_windows, total_duration, is_audible, rms


def audio_to_mel_db(audio):
    """Convert a 5-second audio array into a decibel mel spectrogram of shape (128, 216)."""
    # librosa.power_to_db(ref=max) maps all-zero power to 0 dB everywhere,
    # which otherwise looks like a strong flat signal to the classifier.
    if not len(audio) or float(np.max(np.abs(audio))) < 1e-10:
        return np.full(EXPECTED_MEL_SHAPE, -80.0, dtype=np.float32)

    # Turn sound pressure waves into frequency vs time intensity.
    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=TARGET_SAMPLE_RATE,
        n_mels=N_MELS,
        n_fft=N_FFT,
        hop_length=HOP_LENGTH,
    )

    # Convert raw power to logarithmic decibels (dB), matching human hearing perception.
    mel_db = librosa.power_to_db(mel, ref=np.max)

    # Safety check: make sure the dimensions exactly match what the CNN expects.
    if mel_db.shape != EXPECTED_MEL_SHAPE:
        raise ValueError(
            f"Expected mel shape {EXPECTED_MEL_SHAPE}, got {mel_db.shape}. "
            "Check audio duration and sample rate settings."
        )

    return mel_db


def _trim_silence_edges(audio):
    """Remove leading/trailing silence while preserving the recorded sound."""
    if not len(audio) or float(np.max(np.abs(audio))) < 1e-10:
        return audio
    trimmed, _ = librosa.effects.trim(audio, top_db=55.0)
    return trimmed if len(trimmed) else audio


def normalise_mel(mel_db):
    """Scale mel spectrogram values from roughly -80..0 dB into standard 0.0..1.0 range."""
    # Most vehicle acoustic energy sits between -80 dB and 0 dB.
    # Neural networks converge faster and perform better with normalised [0, 1] inputs.
    return np.clip((mel_db + 80.0) / 80.0, 0.0, 1.0)


def spec_augment(mel_db, max_time_mask=18, max_freq_mask=14):
    """Apply SpecAugment (random time and frequency masking) to a mel spectrogram.
    
    This technique is used during training: by blanking out random frequency bands
    or time slices, the CNN is forced to learn robust acoustic features instead of
    memorising a single tone.
    """
    augmented = mel_db.copy()
    num_mels, num_frames = augmented.shape

    # Random frequency masking: zero out a band of frequency rows.
    f_width = np.random.randint(0, max_freq_mask)
    if f_width > 0:
        f_start = np.random.randint(0, max_mels := max(1, num_mels - f_width))
        augmented[f_start : f_start + f_width, :] = -80.0  # mask with silence (dB floor)

    # Random time masking: zero out a band of time columns.
    t_width = np.random.randint(0, max_time_mask)
    if t_width > 0:
        t_start = np.random.randint(0, max(1, num_frames - t_width))
        augmented[:, t_start : t_start + t_width] = -80.0

    return augmented


def wav_to_model_input(audio_path):
    """Prepare a single 5-second WAV file for CNN prediction (returns shape: 1, 128, 216, 1)."""
    audio = load_standardised_audio(audio_path)
    mel_db = audio_to_mel_db(audio)
    mel_normalised = normalise_mel(mel_db)
    return mel_normalised[np.newaxis, ..., np.newaxis].astype(np.float32)


def windows_to_model_inputs(windows):
    """Convert a list of 5-second audio windows into a batch of CNN inputs.
    
    Returns:
        np.ndarray: shape (len(windows), 128, 216, 1) ready for model.predict()
    """
    batch = []
    for window in windows:
        mel_db = audio_to_mel_db(window)
        mel_norm = normalise_mel(mel_db)
        batch.append(mel_norm[..., np.newaxis])

    return np.array(batch, dtype=np.float32)
