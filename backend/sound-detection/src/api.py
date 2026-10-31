import shutil
import os
from contextlib import asynccontextmanager
from pathlib import Path
from tempfile import NamedTemporaryFile
from uuid import uuid4

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from tensorflow import keras

# librosa delegates compressed formats such as the phone's .m4a recordings to
# ffmpeg. imageio-ffmpeg provides a private binary so no global ffmpeg install
# or PATH edit is required on the developer computer.
try:
    import imageio_ffmpeg

    ffmpeg_directory = str(Path(imageio_ffmpeg.get_ffmpeg_exe()).parent)
    os.environ["PATH"] = ffmpeg_directory + os.pathsep + os.environ.get("PATH", "")
except (ImportError, RuntimeError, OSError):
    pass

try:
    from .config import CLASS_NAMES_PATH, MODEL_PATH, SUPPORTED_AUDIO_EXTENSIONS
except ImportError:
    from config import CLASS_NAMES_PATH, MODEL_PATH, SUPPORTED_AUDIO_EXTENSIONS

try:
    from .predict import load_class_names, predict_audio
except ImportError:
    from predict import load_class_names, predict_audio


# Common audio MIME types to support web frontend blob uploads
MIME_TYPE_EXTENSION_MAP = {
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "audio/wave": ".wav",
    "audio/mp3": ".mp3",
    "audio/mpeg": ".mp3",
    "audio/ogg": ".ogg",
    "audio/vorbis": ".ogg",
    "audio/flac": ".flac",
    "audio/x-flac": ".flac",
    "audio/m4a": ".m4a",
    "audio/x-m4a": ".m4a",
    "audio/mp4": ".m4a",
    "audio/aac": ".aac",
}

# Cache model and class names in memory across requests for rapid inference
ml_context = {
    "model": None,
    "class_names": None,
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Preload ML model and class names on server startup to avoid per-request load latency."""
    try:
        import numpy as np

        ml_context["model"] = keras.models.load_model(MODEL_PATH)
        ml_context["class_names"] = load_class_names(CLASS_NAMES_PATH)
        
        # Warm up the TensorFlow graph and JIT kernels so even the first user request is instant
        dummy_input = np.zeros((1, 128, 216, 1), dtype=np.float32)
        ml_context["model"].predict(dummy_input, verbose=0)
        print("[INFO] Mechanic Sound Detection CNN model loaded and warmed up.")
    except Exception as exc:
        print(f"[WARNING] Could not preload model on startup: {exc}")
    yield
    ml_context.clear()


app = FastAPI(
    title="Mechanic Sound Detection API",
    description="Backend API for diagnosing vehicle mechanical sounds recorded via React Native, mobile, and web apps.",
    lifespan=lifespan,
)

# Enable CORS for front-end clients (React, Vite, Next.js, mobile apps, etc.)
# Setting allow_credentials=False ensures compliance with W3C specs when allow_origins=["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Liveness check; use /health/ready to verify the model is loaded."""
    return {
        "message": "Mechanic Sound Detection API is running",
        "model_loaded": ml_context["model"] is not None,
    }


@app.get("/health/ready")
def readiness():
    """Return ready only when both the trained model and its labels are loaded."""
    ready = ml_context["model"] is not None and ml_context["class_names"] is not None
    if not ready:
        return JSONResponse(
            status_code=503,
            content={
                "status": "not_ready",
                "model_loaded": ml_context["model"] is not None,
                "class_names_loaded": ml_context["class_names"] is not None,
            },
        )
    return {
        "status": "ready",
        "model_loaded": True,
        "class_count": len(ml_context["class_names"]),
    }


@app.post("/predict")
def predict(
    file: UploadFile = File(...),
    vehicle_id: str | None = Form(default=None),
    duration_millis: int | None = Form(default=None),
    recorded_at: str | None = Form(default=None),
):
    """Diagnose a mechanical sound recording uploaded from a mobile or web app.

    The front-end app uploads audio using standard multipart/form-data.
    The backend takes care of audio validation, silence gating, sliding-window
    segmentation, CNN feature extraction, and formatting human-friendly diagnostic advice.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a filename.")
    if ml_context["model"] is None or ml_context["class_names"] is None:
        raise HTTPException(
            status_code=503,
            detail="Sound analysis is starting or the trained model is unavailable. Check /health/ready.",
        )

    suffix = Path(file.filename).suffix.lower()

    # Fallback to content_type if filename has no extension (common in browser Blob uploads)
    if (not suffix or suffix not in SUPPORTED_AUDIO_EXTENSIONS) and file.content_type:
        content_type = file.content_type.split(";")[0].strip().lower()
        if content_type in MIME_TYPE_EXTENSION_MAP:
            suffix = MIME_TYPE_EXTENSION_MAP[content_type]

    if suffix not in SUPPORTED_AUDIO_EXTENSIONS:
        supported = ", ".join(sorted(SUPPORTED_AUDIO_EXTENSIONS))
        detail_msg = (
            f"Unsupported audio format '{suffix or file.filename}'. "
            f"Please upload one of: {supported}"
        )
        if suffix == ".webm":
            detail_msg += ". For web recordings, please record in WAV or OGG format."
        raise HTTPException(status_code=400, detail=detail_msg)

    temp_path = None

    try:
        # Save the uploaded audio to a temporary file on disk so librosa can decode it.
        # delete=False is required on Windows so the file can be reopened safely.
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = Path(temp_file.name)

        # Run multi-window audio analysis and CNN classification using the preloaded model.
        diagnosis = predict_audio(
            temp_path,
            model=ml_context.get("model"),
            class_names=ml_context.get("class_names"),
            top_k=3,
        )

        return {
            "result_id": str(uuid4()),
            "filename": file.filename,
            "vehicle_id": vehicle_id,
            "recorded_at": recorded_at,
            "recorded_duration_millis": duration_millis,
            "status": diagnosis["status"],
            "overall_message": diagnosis["overall_message"],
            "audio_info": diagnosis["audio_info"],
            "top_results": diagnosis["top_results"],
        }

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Model files not found. Ensure training has been run: {exc}",
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Audio processing or diagnosis failed: {exc}",
        ) from exc

    finally:
        file.file.close()

        # Clean up temporary upload file immediately.
        if temp_path and temp_path.exists():
            temp_path.unlink()


if __name__ == "__main__":
    import uvicorn

    # app_dir ensures uvicorn reloader subprocesses reliably find api.py
    src_dir = str(Path(__file__).resolve().parent)
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True, app_dir=src_dir)
