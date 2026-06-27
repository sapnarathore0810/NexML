from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.services.audit_logger import log_error_event
from app.services.file_service import UPLOAD_DIR
from app.services.model_manager import (
    METRICS_PATH,
    MODEL_PATH,
    PREDICTIONS_PATH,
    PREPROCESSING_REPORT_PATH,
    TRAINING_REPORT_PATH,
)
from app.services.prediction import generate_predictions

router = APIRouter(tags=["Prediction"])


@router.post("/predict")
async def predict(file: UploadFile = File(...)) -> dict:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    try:
        upload_path = UPLOAD_DIR / Path(file.filename).name
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        content = await file.read()
        upload_path.write_bytes(content)
        return generate_predictions(upload_path)
    except FileNotFoundError as error:
        log_error_event(context="prediction", filename=file.filename or "", error=str(error))
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ValueError as error:
        log_error_event(context="prediction", filename=file.filename or "", error=str(error))
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        log_error_event(context="prediction", filename=file.filename or "", error=str(error))
        raise HTTPException(status_code=500, detail="Prediction failed") from error


@router.get("/download-model")
async def download_model() -> FileResponse:
    if not MODEL_PATH.exists():
        raise HTTPException(status_code=404, detail="Trained model not found")
    return FileResponse(MODEL_PATH, filename=MODEL_PATH.name, media_type="application/octet-stream")


@router.get("/download-predictions")
async def download_predictions() -> FileResponse:
    if not PREDICTIONS_PATH.exists():
        raise HTTPException(status_code=404, detail="Predictions file not found")
    return FileResponse(PREDICTIONS_PATH, filename=PREDICTIONS_PATH.name, media_type="text/csv")


@router.get("/download-metrics")
async def download_metrics() -> FileResponse:
    if not METRICS_PATH.exists():
        raise HTTPException(status_code=404, detail="Metrics file not found")
    return FileResponse(METRICS_PATH, filename=METRICS_PATH.name, media_type="application/json")


@router.get("/download-preprocessing-report")
async def download_preprocessing_report() -> FileResponse:
    if not PREPROCESSING_REPORT_PATH.exists():
        raise HTTPException(status_code=404, detail="Preprocessing report not found")
    return FileResponse(PREPROCESSING_REPORT_PATH, filename=PREPROCESSING_REPORT_PATH.name, media_type="text/plain")


@router.get("/download-report")
async def download_report() -> FileResponse:
    if not TRAINING_REPORT_PATH.exists():
        raise HTTPException(status_code=404, detail="Training report not found")
    return FileResponse(TRAINING_REPORT_PATH, filename=TRAINING_REPORT_PATH.name, media_type="application/pdf")