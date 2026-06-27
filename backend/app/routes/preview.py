from fastapi import APIRouter, HTTPException

from app.schemas.responses import PreviewResponse
from app.services.file_service import get_dataset_preview

router = APIRouter(tags=["Preview"])


@router.get("/preview/{filename}", response_model=PreviewResponse)
async def dataset_info(filename: str) -> dict:
    try:
        return get_dataset_preview(filename)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail="Unable to generate preview") from error