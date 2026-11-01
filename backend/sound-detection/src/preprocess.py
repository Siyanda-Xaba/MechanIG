import argparse
from pathlib import Path

import numpy as np
import soundfile as sf

# Reuse the same audio helper functions that prediction will use later.
# This helps avoid training one way and predicting another way.
try:
    from .audio_features import audio_to_mel_db, load_standardised_audio
    from .config import (
        MEL_DATASET_DIR,
        RAW_DATASET_DIR,
        STANDARDISED_DATASET_DIR,
        SUPPORTED_AUDIO_EXTENSIONS,
        TARGET_SAMPLE_RATE,
    )
except ImportError:
    from audio_features import audio_to_mel_db, load_standardised_audio
    from config import (
        MEL_DATASET_DIR,
        RAW_DATASET_DIR,
        STANDARDISED_DATASET_DIR,
        SUPPORTED_AUDIO_EXTENSIONS,
        TARGET_SAMPLE_RATE,
    )


def iter_audio_files(folder):
    # Look for the formats that phones commonly record or upload.
    # The extension check is case-insensitive, so .M4A and .m4a both work.
    return sorted(
        file_path
        for file_path in Path(folder).rglob("*")
        if file_path.is_file() and file_path.suffix.lower() in SUPPORTED_AUDIO_EXTENSIONS
    )


def standardise_dataset(raw_dir=RAW_DATASET_DIR, output_dir=STANDARDISED_DATASET_DIR, force=False):
    # Allow the caller to pass either strings or Path objects.
    raw_dir = Path(raw_dir)
    output_dir = Path(output_dir)

    # These counters make it easy to see what happened after the script runs.
    processed_count = 0
    skipped_count = 0

    # Search through all class folders for supported audio files.
    # Example: MechanIQDataSet/EngineKnock/ek1.m4a
    for audio_path in iter_audio_files(raw_dir):
        # The parent folder name is the label/class name.
        label = audio_path.parent.name

        # Keep the same folder structure in StandardisedDataset.
        output_folder = output_dir / label
        output_folder.mkdir(parents=True, exist_ok=True)
        # Always save the cleaned version as WAV, even if the original was mp3/m4a.
        # This gives the next preprocessing stage one simple format to read.
        output_file = output_folder / f"{audio_path.stem}.wav"

        # Do not recreate files that already exist. This keeps repeated runs fast
        # and avoids overwriting work unless we delete the output manually.
        if output_file.exists() and not force:
            skipped_count += 1
            continue

        # Standardise the audio and save it as a normal WAV file.
        audio = load_standardised_audio(audio_path)
        sf.write(output_file, audio, TARGET_SAMPLE_RATE)
        processed_count += 1

    return processed_count, skipped_count


def create_mel_dataset(standardised_dir=STANDARDISED_DATASET_DIR, output_dir=MEL_DATASET_DIR, force=False):
    # This stage starts from the cleaned WAV files, not the raw recordings.
    standardised_dir = Path(standardised_dir)
    output_dir = Path(output_dir)

    processed_count = 0
    skipped_count = 0

    for audio_path in iter_audio_files(standardised_dir):
        # Again, the class label comes from the folder name.
        label = audio_path.parent.name
        output_folder = output_dir / label
        output_folder.mkdir(parents=True, exist_ok=True)

        # Save each spectrogram with the same base filename as the audio.
        # Example: ek1.wav becomes ek1.npy
        output_file = output_folder / f"{audio_path.stem}.npy"

        if output_file.exists() and not force:
            skipped_count += 1
            continue

        # The WAV files are already standardised, but loading through the helper
        # keeps this step consistent and protects us if a file is replaced later.
        audio = load_standardised_audio(audio_path)
        mel_db = audio_to_mel_db(audio)

        # .npy stores the NumPy array directly, which is faster and safer than
        # saving the spectrogram as an image for training.
        np.save(output_file, mel_db)
        processed_count += 1

    return processed_count, skipped_count


def main():
    # argparse lets us run this from the command line and optionally override folders.
    parser = argparse.ArgumentParser(description="Prepare audio data for model training.")
    parser.add_argument("--raw-dir", default=RAW_DATASET_DIR, help="Folder containing labelled WAV files.")
    parser.add_argument(
        "--standardised-dir",
        default=STANDARDISED_DATASET_DIR,
        help="Output folder for standardised WAV files.",
    )
    parser.add_argument("--mel-dir", default=MEL_DATASET_DIR, help="Output folder for mel .npy files.")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Rebuild existing standardised audio and mel files using current preprocessing.",
    )
    args = parser.parse_args()

    # Run both preprocessing stages in order.
    wav_processed, wav_skipped = standardise_dataset(args.raw_dir, args.standardised_dir, force=args.force)
    mel_processed, mel_skipped = create_mel_dataset(args.standardised_dir, args.mel_dir, force=args.force)

    # A small summary is enough to confirm the script did what we expected.
    print("Standardised WAV files")
    print(f"Processed: {wav_processed}")
    print(f"Skipped: {wav_skipped}")
    print()
    print("Mel spectrogram files")
    print(f"Processed: {mel_processed}")
    print(f"Skipped: {mel_skipped}")


if __name__ == "__main__":
    # This prevents main() from running when another file imports this script.
    main()
