from fastapi import APIRouter, HTTPException

from app.schemas.preprocessing import PreprocessRequest, PreprocessResponse
from app.services.preprocessing import preprocess_dataset

router = APIRouter(tags=["Preprocessing"])


@router.post("/preprocess", response_model=PreprocessResponse)
async def preprocess(payload: PreprocessRequest) -> dict:
    try:
        result = preprocess_dataset(payload.filename, payload.target_column)
        return {
            "message": "Preprocessing completed successfully",
            "filename": payload.filename,
            "target_column": result.target_name,
            "feature_names": result.feature_names,
            "summary": result.summary,
            "cleaned_dataset_preview": result.cleaned_dataset.head(10).fillna("").to_dict(orient="records"),
            "processed_dataset_preview": result.processed_dataset.head(10).fillna("").to_dict(orient="records"),
        }
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail="Unable to preprocess dataset") from error
