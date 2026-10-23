# Mechanic Sound Detection

This project trains a Convolutional Neural Network (CNN) to detect and classify vehicle fault sounds from audio recordings converted into mel spectrograms.

## Current Classes

- `BrakeSqueal`: High-frequency brake friction/screech
- `CVJoints`: Constant velocity joint clicking or popping on turns
- `EngineKnock`: Deep rhythmic metallic tapping/knocking from engine
- `SerpentineBelt`: High-pitched belt squealing/chirping
- `StarterAlternator`: Starter motor grinding or alternator bearing whine
- `WheelBearing`: Low-pitched droning or humming that grows with speed

---

## Preprocessing & Pipeline Specification

Both training and inference (backend API and mobile) use the **exact same preprocessing pipeline**, ensuring consistency between how the model learns and how it predicts:

| Parameter                | Specification                                   | Notes                                                                        |
| :----------------------- | :---------------------------------------------- | :--------------------------------------------------------------------------- |
| **Supported Formats**    | `.wav`, `.m4a`, `.mp3`, `.aac`, `.flac`, `.ogg` | Common mobile & studio recording formats (case-insensitive)                  |
| **Channels**             | Mono                                            | Mixed down to 1 channel upon loading                                         |
| **Target Sample Rate**   | `22050 Hz`                                      | Resampled upon loading                                                       |
| **Window Duration**      | `5 seconds`                                     | Exactly `110,250` samples                                                    |
| **Sliding Window Step**  | `2.5 seconds`                                   | 50% overlap for recordings longer than 5 seconds                             |
| **Silence Detection**    | `RMS < 0.003`                                   | Silent or inaudible recordings are rejected with clear user guidance         |
| **Feature Extraction**   | Mel Spectrogram                                 | `n_mels=128`, `n_fft=2048`, `hop_length=512`                                 |
| **Spectrogram Shape**    | `(128, 216)`                                    | 128 frequency bins $\times$ 216 time frames                                  |
| **Normalization**        | `[0.0, 1.0]`                                    | Decibels scaled via `(mel_db + 80.0) / 80.0` clipped between 0 and 1         |
| **Confidence Threshold** | `12% (0.12)`                                    | Scores below threshold are flagged as `inconclusive` to prevent false alarms |

All supported audio formats are decoded first into raw audio, resampled, checked for volume energy, segmented into overlapping 5-second windows, and converted into standard mel spectrogram arrays.

---

## Quickstart & Workflow

### 1. Set Up Python Environment

Use Python 3.12 (or a compatible version with TensorFlow support):

```bash
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# On Linux/macOS:
source .venv/bin/activate

python -m pip install -r requirements.txt
```

### 2. Dataset Preparation

Place labelled raw audio files in `MechanIQDataSet/<ClassName>/`. Any supported audio format (`.wav`, `.m4a`, `.mp3`, `.aac`, `.flac`, `.ogg`) can be added directly.

### 3. Preprocess Audio

Convert raw audio into standardized 5-second 22,050 Hz WAV files, then generate mel spectrogram `.npy` arrays:

```bash
python src/preprocess.py
```

### 4. Train the Model

Train the CNN classifier with SpecAugment audio data augmentation, Batch Normalization, Dropout, and ReduceLROnPlateau:

```bash
python src/train.py --epochs 60
```

This saves:

- Keras model: `models/mechanic_sound_cnn.keras`
- Class label mapping: `models/class_names.json`

### 5. CLI Prediction Test

Diagnose an audio recording of any duration directly from the terminal:

```bash
python src/predict.py "MechanIQDataSet/EngineKnock/ek1.wav"
```

### 6. Export to TensorFlow Lite

Convert the trained model to a compact `.tflite` model for on-device mobile inference:

```bash
# Standard export
python src/export_tflite.py

# Optimized export with dynamic range quantization (~113 KB)
python src/export_tflite.py --quantize
```

Produces: `models/mechanic_sound_cnn.tflite`

---

## Backend API Usage

The backend API uses **FastAPI** to provide real-time audio fault diagnosis for mobile applications and clients.

### Starting the Server

Run uvicorn to start the API:

```bash
# Directly via Python:
python src/api.py

# Or via uvicorn directly (local machine only):
uvicorn src.api:app --reload

# For network / mobile device access (listens on all network interfaces):
uvicorn src.api:app --host 0.0.0.0 --port 8000 --reload
```

### API Endpoints

#### 1. Health Check

- **Method**: `GET`
- **Path**: `/`
- **Response**:
  ```json
  {
    "message": "Mechanic Sound Detection API is running"
  }
  ```

#### Readiness Check

`GET /health/ready` returns HTTP 200 only after both the trained model and class labels have loaded; otherwise it returns HTTP 503. MechanIQ's local launcher uses this route before publishing the API URL to the phone.

#### 2. Sound Prediction

- **Method**: `POST`
- **Path**: `/predict`
- **Content-Type**: `multipart/form-data`
- **Body**: Form field named `file` containing the audio recording.
- **Optional form fields**: `vehicle_id`, `duration_millis`, and `recorded_at`.

#### Testing with cURL:

```bash
# WAV upload
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@MechanIQDataSet/EngineKnock/ek1.wav"

# M4A upload (standard iOS / Android audio recorder output)
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@recording.m4a"

# MP3 upload
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@recording.mp3"
```

#### API Response Schemas

##### A. Clear Fault Detected (`status: "detected"`):

```json
{
  "filename": "engine_recording.m4a",
  "status": "detected",
  "overall_message": "Detected possible EngineKnock sound.",
  "audio_info": {
    "duration_seconds": 8.5,
    "volume_rms": 0.1245,
    "windows_evaluated": 3
  },
  "top_results": [
    {
      "rank": 1,
      "class_name": "EngineKnock",
      "title": "Engine Mechanical Knock / Tap",
      "description": "Deep, metallic, repetitive tapping or knocking from the engine block that speeds up with engine RPM.",
      "symptoms": "Rhythmic thumping or metallic tap inside the engine bay, often worsening under load or acceleration.",
      "recommended_action": "Check engine oil level and pressure immediately. Avoid driving aggressively and have a mechanic diagnose rod bearings, wrist pins, or valvetrain lifters."
    },
    {
      "rank": 2,
      "class_name": "CVJoints",
      "title": "Constant Velocity (CV) Joint Wear",
      "description": "Repetitive clicking, snapping, or popping noise, most noticeable when turning or accelerating.",
      "symptoms": "Clicking or popping sounds when making sharp turns in a parking lot or intersection.",
      "recommended_action": "Check the rubber CV axle boots for tears or grease leaks. If the boot is torn and clicking has begun, the CV axle usually needs replacement."
    }
  ]
}
```

##### B. Low Confidence / Ambient Sound (`status: "inconclusive"`):

```json
{
  "filename": "idle_sound.m4a",
  "status": "inconclusive",
  "overall_message": "No distinct mechanical fault detected. The sound may be normal engine idle or obscured by ambient noise.",
  "audio_info": {
    "duration_seconds": 9.71,
    "volume_rms": 0.1674,
    "windows_evaluated": 3
  },
  "top_results": [ ... ]
}
```

##### C. Silent / Inaudible Audio (`status: "silent_audio"`):

```json
{
  "filename": "silent.wav",
  "status": "silent_audio",
  "overall_message": "Recording is too quiet or silent to diagnose. Please hold the phone closer to the engine or noisy component and try again.",
  "audio_info": {
    "duration_seconds": 5.0,
    "volume_rms": 0.0,
    "windows_evaluated": 0
  },
  "top_results": []
}
```

##### D. Invalid Format (`400 Bad Request`):

```json
{
  "detail": "Unsupported audio format '.txt'. Please upload one of: .aac, .flac, .m4a, .mp3, .ogg, .wav"
}
```

---

## React Native Audio Upload Notes

When integrating audio recording in a React Native app (e.g. via `react-native-audio-recorder-player`, `expo-av`, or `react-native-nitro-sound`), the mobile app only needs to record the sound and pass the file down to the API.

### 1. Network / Host Configuration

Mobile devices cannot reach your developer machine using `localhost` or `127.0.0.1`:

- **Android Emulator**: Use `http://10.0.2.2:8000/predict` (the emulator's alias to host loopback).
- **iOS Simulator**: `http://127.0.0.1:8000/predict` or `http://localhost:8000/predict` works directly.
- **Physical Device (Wi-Fi)**: Use your computer's local LAN IP (e.g., `http://192.168.1.150:8000/predict`). Make sure:
  - Uvicorn is launched with `--host 0.0.0.0`.
  - Your machine's firewall allows incoming connections on port 8000.
  - The phone and computer are on the same Wi-Fi network.

### 2. Android Cleartext Traffic (HTTP)

By default, Android blocks non-HTTPS network requests. For local development with `http://`:
In `android/app/src/main/AndroidManifest.xml`, ensure `usesCleartextTraffic` is enabled:

```xml
<application
    android:usesCleartextTraffic="true"
    ... >
```

### 3. Complete React Native Upload Example

```javascript
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function MechanicDiagnosisScreen({ audioUri }) {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const handleUploadAudio = async () => {
    if (!audioUri) return;

    setLoading(true);
    setDiagnosis(null);

    const formData = new FormData();

    // Extract filename and ensure a valid audio extension is present (.m4a, .wav, etc.)
    const filename = audioUri.split("/").pop() || "sound_recording.m4a";

    formData.append("file", {
      uri: audioUri, // e.g. "file:///data/user/0/.../sound_recording.m4a"
      name: filename, // e.g. "sound_recording.m4a"
      type: "audio/m4a", // or 'audio/wav', 'audio/mpeg'
    });

    try {
      // Replace with your computer's IP (e.g. 10.0.2.2 for Android Emulator, or 192.168.x.x for real device)
      const API_URL = "http://10.0.2.2:8000/predict";

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        // IMPORTANT: Do NOT manually set 'Content-Type': 'multipart/form-data'!
        // React Native fetch automatically creates the Content-Type header with the boundary.
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(
          errJson.detail || `Server returned error ${response.status}`,
        );
      }

      const data = await response.json();
      setDiagnosis(data);
    } catch (err) {
      alert(`Diagnosis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        title="Analyze Sound Recording"
        onPress={handleUploadAudio}
        disabled={loading}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0066cc"
          style={styles.spinner}
        />
      )}

      {diagnosis && (
        <View style={styles.resultsCard}>
          <Text style={styles.statusTitle}>
            Status: {diagnosis.status.toUpperCase()}
          </Text>
          <Text style={styles.overallMessage}>{diagnosis.overall_message}</Text>

          {diagnosis.top_results.map((item) => (
            <View key={item.rank} style={styles.faultCard}>
              <Text style={styles.faultTitle}>
                {item.rank}. {item.title}
              </Text>
              <Text style={styles.faultDesc}>{item.description}</Text>
              <Text style={styles.adviceHeader}>Recommended Action:</Text>
              <Text style={styles.faultAdvice}>{item.recommended_action}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  spinner: { marginTop: 20 },
  resultsCard: {
    marginTop: 20,
    backgroundColor: "#f5f7fa",
    padding: 15,
    borderRadius: 10,
  },
  statusTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  overallMessage: { fontSize: 14, color: "#333", marginBottom: 15 },
  faultCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  faultTitle: { fontWeight: "bold", fontSize: 15, color: "#1a365d" },
  faultDesc: { fontSize: 13, color: "#4a5568", marginVertical: 6 },
  adviceHeader: {
    fontWeight: "600",
    fontSize: 13,
    color: "#2b6cb0",
    marginTop: 4,
  },
  faultAdvice: { fontSize: 13, color: "#2d3748" },
});
```

### 4. Critical React Native Pitfalls

1. **Do NOT set `Content-Type: multipart/form-data` manually**:
   When developers explicitly provide `headers: { 'Content-Type': 'multipart/form-data' }`, React Native removes the auto-generated boundary parameter (e.g. `; boundary=---...`). FastAPI then fails to parse the multipart stream and returns a 422 Unprocessable Entity error. Leave the `Content-Type` header unset so `fetch` manages boundaries automatically.
2. **Ensure Filename Has an Extension**:
   The backend inspects `file.filename` to determine the decoder. If the filename is missing an extension, the API responds with `400 Bad Request`.
3. **Server FFmpeg Requirement for Compressed Formats**:
   The runtime requirements include `imageio-ffmpeg`, which supplies FFmpeg for `.m4a` and `.aac` recordings made by Android and iOS. The API adds that private binary to its own process PATH; a system-wide FFmpeg install is not required.
