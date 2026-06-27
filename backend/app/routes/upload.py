from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.audit_logger import log_error_event
from app.schemas.responses import UploadResponse
from app.services.file_service import save_csv_file

router = APIRouter(tags=["Upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_dataset(file: UploadFile = File(...)) -> dict:
    try:
        return await save_csv_file(file)
    except ValueError as error:
        log_error_event(context="upload", filename=file.filename or "", error=str(error))
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        log_error_event(context="upload", filename=file.filename or "", error=str(error))
        raise HTTPException(status_code=500, detail="Unable to upload file") from error