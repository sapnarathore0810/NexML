from fastapi import APIRouter, HTTPException

from app.services.audit_logger import log_error_event
from app.schemas.responses import TrainRequest, TrainResponse
from app.services.train_service import run_training

router = APIRouter(tags=["Training"])


@router.post("/train", response_model=TrainResponse)
async def train_model(payload: TrainRequest) -> dict:
    try:
        result = run_training(payload.filename, payload.target_column)
        return {
            "message": result.message,
            "filename": result.filename,
            "target_column": result.target_column,
            "problem_type": result.problem_type,
            "best_model": result.best_model,
            "best_reason": result.best_reason,
            "best_parameters": result.best_parameters,
            "best_metrics": result.best_metrics,
            "comparison_table": result.comparison_table,
            "training_time": result.training_time,
            "prediction_time": result.prediction_time,
            "saved_model_path": result.saved_model_path,
            "metrics_path": result.metrics_path,
            "preprocessing_report_path": result.preprocessing_report_path,
            "training_report_path": result.training_report_path,
            "recommendation": result.recommendation,
            "activity_log": result.activity_log,
            "number_of_samples": result.number_of_samples,
            "number_of_features": result.number_of_features,
            "dataset_quality_score": result.dataset_quality_score,
            "model_confidence": result.model_confidence,
            "model_complexity": result.model_complexity,
            "feature_importance": result.feature_importance,
            "explainability": result.explainability,
            "roc_curve": result.roc_curve,
            "precision_recall_curve": result.precision_recall_curve,
            "warnings": result.warnings,
            "best_practices": result.best_practices,
        }
    except FileNotFoundError as error:
        log_error_event(context="training", filename=payload.filename, target_column=payload.target_column, error=str(error))
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ValueError as error:
        log_error_event(context="training", filename=payload.filename, target_column=payload.target_column, error=str(error))
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        log_error_event(context="training", filename=payload.filename, target_column=payload.target_column, error=str(error))
        raise HTTPException(status_code=500, detail="Training failed") from error