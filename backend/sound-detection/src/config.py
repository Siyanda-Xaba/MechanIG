from pathlib import Path


# Work out the main project folder from this file's location.
# This keeps the scripts usable even if we run them from another folder.
PROJECT_ROOT = Path(__file__).resolve().parents[1]

# Main folders used by the pipeline.
# Raw audio starts in MechanIQDataSet, then we create cleaned WAV files,
# then we create mel spectrogram arrays, and finally save trained models.
RAW_DATASET_DIR = PROJECT_ROOT / "MechanIQDataSet"
STANDARDISED_DATASET_DIR = PROJECT_ROOT / "StandardisedDataset"
MEL_DATASET_DIR = PROJECT_ROOT / "MelSpectrogramDataset"
MODELS_DIR = PROJECT_ROOT / "models"

# Audio formats we accept from the dataset and from the API.
# The model never sees these formats directly; they are all decoded and
# converted into the same mono signal before feature extraction.
SUPPORTED_AUDIO_EXTENSIONS = {".wav", ".m4a", ".mp3", ".aac", ".flac", ".ogg"}

# Every recording window is forced into the same audio format:
# 22050 Hz preserves vehicle acoustic details while keeping file size small.
TARGET_SAMPLE_RATE = 22050
TARGET_DURATION_SECONDS = 5
TARGET_SAMPLES = TARGET_SAMPLE_RATE * TARGET_DURATION_SECONDS

# For recordings longer than 5 seconds, we slide a 5-second window forward
# by 2.5 seconds (50% overlap). This catches sounds that occur later in the clip.
WINDOW_STEP_SECONDS = 2.5
WINDOW_STEP_SAMPLES = int(TARGET_SAMPLE_RATE * WINDOW_STEP_SECONDS)

# Root-Mean-Square (RMS) volume threshold. If the average volume is below
# this value, the recording is flagged as silent or too quiet to diagnose.
MIN_ENERGY_THRESHOLD = 0.003

# The prediction API reports low-scoring predictions as inconclusive. This is a
# conservative display cutoff, not a calibrated probability or a diagnosis.
CONFIDENCE_THRESHOLD = 0.80

# These classes have too few recordings for reliable class-level evaluation.
# Keep any match provisional even when the CNN's softmax score is high.
LOW_SUPPORT_CLASSES = {"CVJoints", "WheelBearing"}

# Mel spectrogram settings.
# These values must stay the same during training and prediction.
# If they change later, the model will need to be trained again.
N_MELS = 128
N_FFT = 2048
HOP_LENGTH = 512

# For 5 seconds of audio at 22050 Hz with hop_length 512, librosa gives
# 216 time frames. The CNN is built around this exact input shape.
EXPECTED_MEL_SHAPE = (N_MELS, 216)

# Used when shuffling the dataset so our train/validation/test split
# is repeatable each time we run the script.
RANDOM_SEED = 42

# Output files created after training/export.
MODEL_PATH = MODELS_DIR / "mechanic_sound_cnn.keras"
TFLITE_MODEL_PATH = MODELS_DIR / "mechanic_sound_cnn.tflite"
CLASS_NAMES_PATH = MODELS_DIR / "class_names.json"

# Plain-English mechanic explanations and recommended steps for each fault.
# The mobile app displays these directly to the user.
FAULT_DESCRIPTIONS = {
    "BrakeSqueal": {
        "title": "Brake System Noise / Squeal",
        "description": "High-pitched friction sound typically produced during braking or slow wheel rotation.",
        "symptoms": "High-frequency squeak or screech when pressing the brake pedal.",
        "recommended_action": "Inspect brake pad thickness, check for rotor glazing, and ensure brake calipers are not sticking.",
    },
    "CVJoints": {
        "title": "Constant Velocity (CV) Joint Wear",
        "description": "Repetitive clicking, snapping, or popping noise, most noticeable when turning or accelerating.",
        "symptoms": "Clicking or popping sounds when making sharp turns in a parking lot or intersection.",
        "recommended_action": "Check the rubber CV axle boots for tears or grease leaks. If the boot is torn and clicking has begun, the CV axle usually needs replacement.",
    },
    "EngineKnock": {
        "title": "Engine Mechanical Knock / Tap",
        "description": "Deep, metallic, repetitive tapping or knocking from the engine block that speeds up with engine RPM.",
        "symptoms": "Rhythmic thumping or metallic tap inside the engine bay, often worsening under load or acceleration.",
        "recommended_action": "Check engine oil level and pressure immediately. Avoid driving aggressively and have a mechanic diagnose rod bearings, wrist pins, or valvetrain lifters.",
    },
    "SerpentineBelt": {
        "title": "Accessory Drive / Serpentine Belt Noise",
        "description": "Loud, high-pitched squealing or chirping noise from the front of the engine.",
        "symptoms": "Squealing on engine startup, when turning the steering wheel sharply, or when the air conditioner turns on.",
        "recommended_action": "Inspect the serpentine belt for cracks, glazing, or slack. Check belt tensioner and idler pulley bearings for smooth rotation.",
    },
    "StarterAlternator": {
        "title": "Starter Motor or Alternator Noise",
        "description": "Harsh grinding, buzzing, or whirring noise during engine cranking or continuous bearing whine while running.",
        "symptoms": "Difficulty starting, grinding sound when turning the key, or high-pitched electrical whine from the alternator.",
        "recommended_action": "Test battery voltage and alternator charging output. If grinding occurs only during cranking, inspect the starter motor bendix gear and flywheel teeth.",
    },
    "HealthySounds": {
        "title": "Normal Engine Operation",
        "description": "Clean, smooth engine idle or running sound with no abnormal mechanical friction, clicking, or knocking.",
        "symptoms": "Consistent rhythm, normal vehicle background acoustics, no abnormal squeaks or rattles.",
        "recommended_action": "No immediate mechanical action required. Continue following regular vehicle maintenance schedules.",
    },
    "WheelBearing": {
        "title": "Wheel Hub / Bearing Wear",
        "description": "Low-pitched droning, humming, or growling sound that grows louder with vehicle speed.",
        "symptoms": "Humming or rumbling sound that changes pitch when gently swerving or loading weight onto one side of the vehicle.",
        "recommended_action": "Safely lift each wheel and check for play, looseness, or roughness when spinning the tire by hand. Worn wheel bearings should be replaced promptly.",
    },
}
