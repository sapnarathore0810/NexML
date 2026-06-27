from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd

from app.services.audit_logger import log_prediction_event
from app.services.evaluation import evaluate_classification_model, evaluate_regression_model
from app.services.model_manager import PREDICTIONS_PATH, ensure_artifact_dirs, load_model_package
from app.services.preprocessing import transform_for_prediction


def _build_prediction_summary(problem_type: str, predictions: pd.Series, probabilities=None) -> dict[str, Any]:
    if problem_type == "classification":
        return {
            "class_distribution": predictions.value_counts(dropna=False).to_dict(),
            "probabilities_available": probabilities is not None,
        }

    return {
        "mean_prediction": round(float(predictions.mean()), 4),
        "min_prediction": round(float(predictions.min()), 4),
        "max_prediction": round(float(predictions.max()), 4),
    }


def generate_predictions(file_path: Path) -> dict[str, Any]:
    ensure_artifact_dirs()
    package = load_model_package()
    model = package["model"]
    problem_type = package["problem_type"]
    artifact = package["preprocessor"]

    try:
        dataframe = pd.read_csv(file_path)
    except Exception as error:
        raise ValueError("Uploaded prediction file could not be read as CSV") from error

    transformed = transform_for_prediction(dataframe, artifact)
    predictions = model.predict(transformed)

    prediction_frame = dataframe.copy()
    prediction_frame["prediction"] = predictions

    probabilities_payload = None
    if problem_type == "classification" and hasattr(model, "predict_proba"):
        try:
            raw_probabilities = model.predict_proba(transformed)
            class_names = package.get("target_classes") or [str(index) for index in range(raw_probabilities.shape[1])]
            probabilities_payload = [
                {class_names[index]: round(float(value), 6) for index, value in enumerate(row)}
                for row in raw_probabilities
            ]
            if class_names:
                prediction_frame["prediction_probability"] = raw_probabilities.max(axis=1)
        except Exception:
            probabilities_payload = None

    prediction_frame.to_csv(PREDICTIONS_PATH, index=False)

    log_prediction_event(
        filename=Path(file_path).name,
        problem_type=problem_type,
        total_records=int(prediction_frame.shape[0]),
        predictions_saved=str(PREDICTIONS_PATH),
    )

    return {
        "filename": Path(file_path).name,
        "problem_type": problem_type,
        "total_records": int(prediction_frame.shape[0]),
        "predictions": prediction_frame["prediction"].tolist(),
        "probabilities": probabilities_payload,
        "prediction_summary": _build_prediction_summary(problem_type, prediction_frame["prediction"], probabilities_payload),
        "saved_predictions_path": str(PREDICTIONS_PATH),
    }
