import argparse
import json
from pathlib import Path

import numpy as np
from tensorflow import keras

try:
    from .audio_features import load_audio_windows, windows_to_model_inputs
    from .config import (
        CLASS_NAMES_PATH,
        CONFIDENCE_THRESHOLD,
        FAULT_DESCRIPTIONS,
        LOW_SUPPORT_CLASSES,
        MODEL_PATH,
    )
except ImportError:
    from audio_features import load_audio_windows, windows_to_model_inputs
    from config import (
        CLASS_NAMES_PATH,
        CONFIDENCE_THRESHOLD,
        FAULT_DESCRIPTIONS,
        LOW_SUPPORT_CLASSES,
        MODEL_PATH,
    )


def load_class_names(class_names_path=CLASS_NAMES_PATH):
    """Load the ordered list of fault class names saved during training."""
    return json.loads(Path(class_names_path).read_text(encoding="utf-8"))


def predict_audio(
    audio_path,
    model=None,
    class_names=None,
    model_path=MODEL_PATH,
    class_names_path=CLASS_NAMES_PATH,
    top_k=3,
):
    """Diagnose an audio recording of any duration.
    
    This function handles:
    1. Silence detection: flags empty or inaudible recordings.
    2. Multi-window analysis: slides 5s windows across longer clips and aggregates predictions.
    3. Confidence thresholding: flags ambiguous sounds as inconclusive instead of false alarms.
    4. Diagnostic explanations: provides plain-English descriptions and recommended mechanic actions.
    """
    if class_names is None:
        class_names = load_class_names(class_names_path)
    if model is None:
        model = keras.models.load_model(model_path)

    # 1. Load audio and extract 5-second overlapping analysis windows.
    windows, total_duration, is_audible, rms = load_audio_windows(audio_path)

    # 2. Guard against silent or inaudible recordings.
    if not is_audible:
        return {
            "status": "silent_audio",
            "overall_message": (
                "Recording is too quiet or silent to diagnose. "
                "Please hold the phone closer to the engine or noisy component and try again."
            ),
            "audio_info": {
                "duration_seconds": round(total_duration, 2),
                "volume_rms": round(rms, 5),
                "windows_evaluated": 0,
            },
            "top_results": [],
        }

    # 3. Convert all 5-second windows into CNN mel spectrogram inputs.
    model_inputs = windows_to_model_inputs(windows)

    # 4. Predict probabilities across all windows and compute the average score.
    window_predictions = model.predict(model_inputs, verbose=0)
    averaged_probabilities = np.mean(window_predictions, axis=0)

    # 5. Rank classes from highest confidence to lowest.
    top_indexes = np.argsort(averaged_probabilities)[::-1][:top_k]
    highest_confidence = float(averaged_probabilities[top_indexes[0]])
    primary_fault = class_names[top_indexes[0]]

    # 6. Avoid presenting a weak or data-poor class match as a diagnosis.
    if primary_fault in LOW_SUPPORT_CLASSES:
        status = "inconclusive"
        overall_message = (
            f"The sound may resemble {primary_fault}, but this model has very few "
            "verified recordings for that category. Treat this only as a possible "
            "match and have a qualified mechanic check it."
        )
    elif highest_confidence < CONFIDENCE_THRESHOLD:
        status = "inconclusive"
        overall_message = (
            "Sound analysis is inconclusive. The recording did not match a trained "
            "sound pattern strongly enough. Try recording closer to the sound in a "
            "quiet place, or ask a qualified mechanic to inspect it."
        )
    elif primary_fault == "HealthySounds":
        status = "detected"
        overall_message = (
            "The recording most closely matches the model's normal-engine examples. "
            "This does not rule out a vehicle fault."
        )
    else:
        status = "detected"
        overall_message = f"Possible {primary_fault} sound pattern detected; have a mechanic confirm it."

    # 7. Format top results with user-friendly descriptions and mechanic recommendations
    # without exposing raw confidence statistics.
    top_results = []
    for rank, idx in enumerate(top_indexes, start=1):
        c_name = class_names[idx]
        advice = FAULT_DESCRIPTIONS.get(c_name, {})
        recommended_action = advice.get("recommended_action", "")
        if c_name in LOW_SUPPORT_CLASSES:
            recommended_action = (
                "This category has too few verified training recordings for reliable "
                "identification. Treat this match as tentative and ask a qualified "
                "mechanic to inspect the vehicle."
            )

        top_results.append(
            {
                "rank": rank,
                "class_name": c_name,
                "confidence_percent": f"{round(float(averaged_probabilities[idx]) * 100, 1)}%",
                "confidence_score": round(float(averaged_probabilities[idx]), 4),
                "title": advice.get("title", c_name),
                "description": advice.get("description", ""),
                "symptoms": advice.get("symptoms", ""),
                "recommended_action": recommended_action,
            }
        )

    return {
        "status": status,
        "overall_message": overall_message,
        "audio_info": {
            "duration_seconds": round(total_duration, 2),
            "volume_rms": round(rms, 5),
            "windows_evaluated": len(windows),
        },
        "top_results": top_results,
    }


def main():
    parser = argparse.ArgumentParser(description="Predict mechanical fault from an audio file.")
    parser.add_argument("audio_path", help="Path to audio file (.wav, .m4a, .mp3, etc.).")
    parser.add_argument("--model-path", default=MODEL_PATH, help="Path to saved model.")
    parser.add_argument("--class-names-path", default=CLASS_NAMES_PATH, help="Path to class names JSON.")
    parser.add_argument("--top-k", type=int, default=3, help="Number of ranked results.")
    args = parser.parse_args()

    result = predict_audio(
        args.audio_path,
        model_path=args.model_path,
        class_names_path=args.class_names_path,
        top_k=args.top_k,
    )

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
