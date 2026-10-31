import argparse
from pathlib import Path

import tensorflow as tf

try:
    from .config import MODEL_PATH, TFLITE_MODEL_PATH
except ImportError:
    from config import MODEL_PATH, TFLITE_MODEL_PATH


def export_tflite(model_path=MODEL_PATH, output_path=TFLITE_MODEL_PATH, quantize=False):
    """Convert the trained Keras CNN model into a TensorFlow Lite (.tflite) file.
    
    TensorFlow Lite is the cross-platform format used by mobile applications
    (including React Native via react-native-fast-tflite or TensorFlow Lite React Native).
    
    Args:
        model_path: Path to the .keras model file.
        output_path: Path where the .tflite model should be saved.
        quantize: If True, applies post-training weight quantization (FP16/INT8 dynamic range),
                  which shrinks file size by up to 75% and speeds up mobile inference.
    """
    model = tf.keras.models.load_model(model_path)
    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    if quantize:
        # Optimise for mobile size and latency using dynamic range quantization.
        converter.optimizations = [tf.lite.Optimize.DEFAULT]

    # Convert the neural network graph into compact binary instructions.
    tflite_model = converter.convert()

    # Save to disk.
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(tflite_model)
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Export the trained Keras model to TensorFlow Lite.")
    parser.add_argument("--model-path", default=MODEL_PATH, help="Path to saved Keras model.")
    parser.add_argument("--output-path", default=TFLITE_MODEL_PATH, help="Path for exported .tflite model.")
    parser.add_argument(
        "--quantize",
        action="store_true",
        help="Apply post-training quantization to reduce model size for mobile devices.",
    )
    args = parser.parse_args()

    output_path = export_tflite(args.model_path, args.output_path, quantize=args.quantize)
    file_size_kb = output_path.stat().st_size / 1024
    print(f"Saved TensorFlow Lite model: {output_path} ({file_size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
