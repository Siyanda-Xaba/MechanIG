import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

try:
    from .audio_features import normalise_mel, spec_augment
    from .config import (
        CLASS_NAMES_PATH,
        MEL_DATASET_DIR,
        MODEL_PATH,
        MODELS_DIR,
        RANDOM_SEED,
    )
except ImportError:
    from audio_features import normalise_mel, spec_augment
    from config import (
        CLASS_NAMES_PATH,
        MEL_DATASET_DIR,
        MODEL_PATH,
        MODELS_DIR,
        RANDOM_SEED,
    )


def load_mel_dataset(mel_dir=MEL_DATASET_DIR):
    """Load all saved mel spectrogram .npy arrays organised by class folder."""
    mel_dir = Path(mel_dir)

    # Class names come from the folder names inside MelSpectrogramDataset.
    class_names = sorted(folder.name for folder in mel_dir.iterdir() if folder.is_dir())

    samples_by_fingerprint = {}
    silent_count = 0

    for class_index, class_name in enumerate(class_names):
        class_files = sorted((mel_dir / class_name).glob("*.npy"))
        for file_path in class_files:
            # Load the precomputed (128, 216) decibel mel spectrogram.
            sample = np.load(file_path)
            if not np.isfinite(sample).all():
                continue
            # Blank recordings cannot support a sound diagnosis.
            if np.max(sample) <= -79.999:
                silent_count += 1
                continue
            fingerprint = hashlib.sha256(np.ascontiguousarray(sample).tobytes()).hexdigest()
            samples_by_fingerprint.setdefault(fingerprint, []).append(
                (sample, class_index, file_path)
            )

    # Collapse identical inputs so copies cannot leak between train/val/test.
    # If one input has conflicting folder labels, exclude the whole group.
    X, y, file_paths = [], [], []
    duplicate_count = 0
    conflict_count = 0
    for records in samples_by_fingerprint.values():
        labels = {record[1] for record in records}
        if len(labels) > 1:
            conflict_count += len(records)
            continue
        duplicate_count += len(records) - 1
        sample, label, file_path = records[0]
        X.append(sample)
        y.append(label)
        file_paths.append(file_path)

    print(
        "Dataset cleanup: "
        f"excluded {silent_count} silent clips, {duplicate_count} duplicate inputs, "
        f"and {conflict_count} samples in conflicting-label groups."
    )

    if not X:
        raise ValueError(f"No .npy files found in {mel_dir}. Run preprocess.py first.")

    return np.array(X), np.array(y), class_names, file_paths


def split_per_class(X, y, file_paths, class_names):
    """Create a balanced train / validation / test split.
    
    Uses a proportional split (~70% train, ~15% val, ~15% test) while ensuring
    every class has at least 1 sample in validation and test even if sample count is small.
    """
    X_train, y_train, paths_train = [], [], []
    X_val, y_val, paths_val = [], [], []
    X_test, y_test, paths_test = [], [], []

    print("\nDataset split per class:")
    for class_index, class_name in enumerate(class_names):
        class_indices = np.where(y == class_index)[0]

        # Use a reproducible random shuffle for fair comparisons between runs.
        rng = np.random.default_rng(RANDOM_SEED)
        rng.shuffle(class_indices)

        n = len(class_indices)
        if n < 3:
            raise ValueError(
                f"Class '{class_name}' has only {n} samples. "
                "At least 3 samples are needed for train/val/test splits."
            )

        # Proportional split: ~70% train, ~15% val, ~15% test (at least 1 each)
        val_count = max(1, int(round(n * 0.15)))
        test_count = max(1, int(round(n * 0.15)))
        train_count = n - val_count - test_count
        if train_count < 1:
            train_count = 1
            if val_count > 1:
                val_count -= 1
            elif test_count > 1:
                test_count -= 1

        train_idx = class_indices[:train_count]
        val_idx = class_indices[train_count : train_count + val_count]
        test_idx = class_indices[train_count + val_count :]

        print(f"  - {class_name:<20}: {train_count:>3} train | {val_count:>2} val | {test_count:>2} test (total: {n})")

        for i in train_idx:
            X_train.append(X[i])
            y_train.append(y[i])
            paths_train.append(file_paths[i])

        for i in val_idx:
            X_val.append(X[i])
            y_val.append(y[i])
            paths_val.append(file_paths[i])

        for i in test_idx:
            X_test.append(X[i])
            y_test.append(y[i])
            paths_test.append(file_paths[i])

    return (
        np.array(X_train),
        np.array(y_train),
        paths_train,
        np.array(X_val),
        np.array(y_val),
        paths_val,
        np.array(X_test),
        np.array(y_test),
        paths_test,
    )


def augment_training_data(
    X_train,
    y_train,
    copies_per_sample=2,
    healthy_class_index=None,
    background_mix_probability=0.5,
):
    """Add timing and background variation without inventing new labels.

    Many fault examples are short, tightly cropped clips. Moving their active sound
    to random positions in the five-second window prevents the model from learning
    that a fault is always at the start of a silent, padded clip. Some fault copies
    are also mixed with quiet healthy-car audio to simulate a phone recording made
    with an engine running in the background.
    """
    augmented_X = list(X_train)
    augmented_y = list(y_train)
    rng = np.random.default_rng(RANDOM_SEED)
    healthy_rows = np.where(y_train == healthy_class_index)[0] if healthy_class_index is not None else np.array([], dtype=int)
    frame_count = X_train.shape[2]

    def move_active_sound(spec):
        # Normalised spectrogram padding is -80 dB. Detect the non-padded interval;
        # recordings with continuous background sound naturally keep the whole span.
        active_frames = np.flatnonzero(np.max(spec, axis=0) > -68.0)
        if not len(active_frames):
            return spec.copy()
        first, last = int(active_frames[0]), int(active_frames[-1]) + 1
        content = spec[:, first:last]
        slack = max(0, frame_count - content.shape[1])
        if slack == 0:
            return spec.copy()
        destination = int(rng.integers(0, slack + 1))
        moved = np.full_like(spec, -80.0)
        moved[:, destination:destination + content.shape[1]] = content
        return moved

    def mix_quiet_car_background(foreground, background):
        # Spectrograms are in dB relative to their own peak. Add their mel powers
        # at a random signal-to-background ratio, then restore the usual 0 dB peak.
        fg_power = np.power(10.0, np.clip(foreground, -80.0, 0.0) / 10.0)
        bg_power = np.power(10.0, np.clip(background, -80.0, 0.0) / 10.0)
        background_snr_db = float(rng.uniform(12.0, 24.0))
        mixed_power = fg_power + bg_power * np.power(10.0, -background_snr_db / 10.0)
        mixed_db = 10.0 * np.log10(np.maximum(mixed_power, 1e-8))
        return mixed_db - float(np.max(mixed_db))

    for i in range(len(X_train)):
        spec = X_train[i]
        label = y_train[i]

        for _ in range(copies_per_sample):
            aug_spec = move_active_sound(spec)
            if (
                healthy_rows.size
                and label != healthy_class_index
                and rng.random() < background_mix_probability
            ):
                background_index = int(rng.choice(healthy_rows))
                background = np.roll(X_train[background_index], int(rng.integers(0, frame_count)), axis=1)
                aug_spec = mix_quiet_car_background(aug_spec, background)

            aug_spec = spec_augment(aug_spec, max_time_mask=16, max_freq_mask=12)
            augmented_X.append(aug_spec)
            augmented_y.append(label)

    return np.array(augmented_X), np.array(augmented_y)
def prepare_for_cnn(X):
    """Scale decibels to 0..1 and add the 1-channel dimension required by Conv2D."""
    return normalise_mel(X)[..., np.newaxis].astype(np.float32)


def build_model(input_shape, class_count):
    """Build a Convolutional Neural Network with Batch Normalization and Dropout.
    
    Batch Normalization keeps signals well-scaled through deep layers.
    Dropout randomly turns off neurons during training to prevent overfitting.
    """
    model = keras.Sequential(
        [
            layers.Input(shape=input_shape),

            # Block 1: Detect low-level acoustic edges, pulses, and pitch lines.
            layers.Conv2D(16, kernel_size=(3, 3), padding="same", activation="relu"),
            layers.BatchNormalization(),
            layers.MaxPooling2D(pool_size=(2, 2)),

            # Block 2: Detect patterns across frequencies (e.g. harmonic squeals or rhythmic knocks).
            layers.Conv2D(32, kernel_size=(3, 3), padding="same", activation="relu"),
            layers.BatchNormalization(),
            layers.MaxPooling2D(pool_size=(2, 2)),

            # Block 3: Higher-level acoustic fault representations.
            layers.Conv2D(64, kernel_size=(3, 3), padding="same", activation="relu"),
            layers.BatchNormalization(),
            layers.MaxPooling2D(pool_size=(2, 2)),

            # Condense the 2D feature maps down into a 1D vector.
            layers.GlobalAveragePooling2D(),

            # A compact head keeps the model small for local training and use.
            layers.Dropout(0.3),
            layers.Dense(32, activation="relu"),
            layers.Dropout(0.2),

            # Softmax outputs the probability distribution across all fault classes.
            layers.Dense(class_count, activation="softmax"),
        ]
    )

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


def save_class_names(class_names, output_path=CLASS_NAMES_PATH):
    """Save the ordered list of class names so prediction maps index 0, 1, 2 to names."""
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(class_names, indent=2), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Train the mechanic sound detection CNN.")
    parser.add_argument("--mel-dir", default=MEL_DATASET_DIR, help="Path to mel spectrogram folder.")
    parser.add_argument("--model-path", default=MODEL_PATH, help="Output path for the trained model.")
    parser.add_argument("--epochs", type=int, default=60, help="Maximum training epochs.")
    parser.add_argument("--augment", action="store_true", default=True, help="Use audio data augmentation.")
    args = parser.parse_args()

    # Fix seed for reproducible splits and training.
    tf.keras.utils.set_random_seed(RANDOM_SEED)

    # 1. Load dataset
    X, y, class_names, file_paths = load_mel_dataset(args.mel_dir)

    # 2. Train / Val / Test split
    (
        X_train_raw,
        y_train_raw,
        _,
        X_val_raw,
        y_val_raw,
        _,
        X_test_raw,
        y_test_raw,
        _,
    ) = split_per_class(X, y, file_paths, class_names)

    # 3. Data Augmentation (triples effective training data with SpecAugment)
    if args.augment:
        print(f"Applying SpecAugment data augmentation (original training samples: {len(X_train_raw)})...")
        X_train_aug, y_train_aug = augment_training_data(
            X_train_raw,
            y_train_raw,
            copies_per_sample=2,
            healthy_class_index=class_names.index("HealthySounds"),
        )
        print(f"Augmented training samples: {len(X_train_aug)}")
    else:
        X_train_aug, y_train_aug = X_train_raw, y_train_raw

    # 4. Prepare arrays for CNN (scale to 0..1 and add channel dimension)
    X_train = prepare_for_cnn(X_train_aug)
    y_train = y_train_aug

    X_val = prepare_for_cnn(X_val_raw)
    y_val = y_val_raw

    X_test = prepare_for_cnn(X_test_raw)
    y_test = y_test_raw

    # 5. Build model
    model = build_model(input_shape=X_train.shape[1:], class_count=len(class_names))
    model.summary()

    # 6. Training callbacks
    early_stopping = keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=15,
        restore_best_weights=True,
    )

    # Reduce learning rate when validation loss stops improving.
    reduce_lr = keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=5,
        min_lr=1e-5,
        verbose=1,
    )

    # Moderate the imbalance without letting the very small rare classes
    # dominate every batch. Raw class counts are used because augmentation
    # multiplies all classes equally and must not alter their relative weights.
    train_class_counts = np.bincount(y_train_raw, minlength=len(class_names))
    inverse_frequency = np.sqrt(
        len(y_train_raw) / (len(class_names) * np.maximum(train_class_counts, 1))
    )
    class_weights = {
        class_index: float(np.clip(weight, 0.5, 2.0))
        for class_index, weight in enumerate(inverse_frequency)
    }
    print("\nCapped class weights:")
    for class_index, class_name in enumerate(class_names):
        print(f"  - {class_name:<20}: {class_weights[class_index]:.2f}")

    # 7. Train the model
    model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        class_weight=class_weights,
        epochs=args.epochs,
        callbacks=[early_stopping, reduce_lr],
        verbose=1,
    )

    # 8. Evaluate on test set
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)

    # Per-class test predictions summary
    test_preds = model.predict(X_test, verbose=0)
    test_pred_classes = np.argmax(test_preds, axis=1)

    print("\n--- Per-Class Test Accuracy & Confidence ---")
    for c_idx, c_name in enumerate(class_names):
        idxs = np.where(y_test == c_idx)[0]
        if len(idxs) == 0:
            continue
        c_matches = (test_pred_classes[idxs] == c_idx).sum()
        c_acc = (c_matches / len(idxs)) * 100
        avg_conf = np.mean([test_preds[k][test_pred_classes[k]] for k in idxs]) * 100
        print(f"  {c_name:<20}: {c_matches}/{len(idxs)} correct ({c_acc:>5.1f}%) | Avg Confidence: {avg_conf:>5.1f}%")

    print("\n--- Test Set Sample Predictions ---")
    for i in range(len(y_test)):
        true_name = class_names[y_test[i]]
        pred_name = class_names[test_pred_classes[i]]
        conf = test_preds[i][test_pred_classes[i]] * 100
        match = "MATCH" if true_name == pred_name else "MISMATCH"
        print(f"  Sample {i+1:>3} [{true_name:<18}] -> Predicted [{pred_name:<18}] ({conf:>5.1f}% confidence) [{match}]")

    # 9. Save model and class mapping
    model_path = Path(args.model_path)
    model_path.parent.mkdir(parents=True, exist_ok=True)
    model.save(model_path)
    save_class_names(class_names, MODELS_DIR / "class_names.json")

    print(f"\nModel saved successfully: {model_path}")
    print(f"Class names saved: {CLASS_NAMES_PATH}")


if __name__ == "__main__":
    main()
