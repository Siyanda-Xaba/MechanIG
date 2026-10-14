import shutil
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import FastAPI, File, HTTPException, UploadFile

try:
    from .config import SUPPORTED_AUDIO_EXTENSIONS
except ImportError:
    from config import SUPPORTED_AUDIO_EXTENSIONS

try:
    from .predict import predict_audio
except ImportError:
    from predict import predict_audio


app = FastAPI(
    title="Mechanic Sound Detection API",
    description="Backend API for diagnosing vehicle mechanical sounds recorded via React Native and mobile apps.",
)


@app.get("/")
def read_root():
    """Health check endpoint to verify that the server is online and ready."""
    return {"message": "Mechanic Sound Detection API is running"}


@app.post("/predict")
def predict(file: UploadFile = File(...)):
    """Diagnose a mechanical sound recording uploaded from a mobile app.
    
    The React Native app uploads audio using standard multipart/form-data.
    The backend takes care of audio validation, silence gating, sliding-window
    segmentation, CNN feature extraction, and formatting human-friendly diagnostic advice.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a filename.")

    suffix = Path(file.filename).suffix.lower()

    if suffix not in SUPPORTED_AUDIO_EXTENSIONS:
        supported = ", ".join(sorted(SUPPORTED_AUDIO_EXTENSIONS))
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format '{suffix}'. Please upload one of: {supported}",
        )

    temp_path = None

    try:
        # Save the uploaded audio to a temporary file on disk so librosa can decode it.
        # delete=False is required on Windows so the file can be reopened safely.
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = Path(temp_file.name)

        # Run multi-window audio analysis and CNN classification.
        diagnosis = predict_audio(temp_path, top_k=3)

        return {
            "filename": file.filename,
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
