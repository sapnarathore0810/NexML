from __future__ import annotations

from time import perf_counter
from typing import Any

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    confusion_matrix,
    f1_score,
    precision_recall_curve,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
    roc_curve,
    roc_auc_score,
)


def evaluate_classification_model(model, x_test, y_test, *, average: str = "weighted") -> dict[str, Any]:
    prediction_start = perf_counter()
    predictions = model.predict(x_test)
    prediction_time = perf_counter() - prediction_start

    probabilities = None
    if hasattr(model, "predict_proba"):
        try:
            probabilities = model.predict_proba(x_test)
        except Exception:
            probabilities = None

    metrics: dict[str, Any] = {
        "accuracy": round(float(accuracy_score(y_test, predictions)) * 100, 2),
        "precision": round(float(precision_score(y_test, predictions, average=average, zero_division=0)) * 100, 2),
        "recall": round(float(recall_score(y_test, predictions, average=average, zero_division=0)) * 100, 2),
        "f1_score": round(float(f1_score(y_test, predictions, average=average, zero_division=0)) * 100, 2),
        "confusion_matrix": confusion_matrix(y_test, predictions).tolist(),
        "prediction_time": round(float(prediction_time), 4),
    }

    if probabilities is not None:
        try:
            if len(np.unique(y_test)) == 2 and probabilities.shape[1] == 2:
                positive_scores = probabilities[:, 1]
                metrics["roc_auc"] = round(float(roc_auc_score(y_test, positive_scores)) * 100, 2)
                precision_values, recall_values, thresholds = precision_recall_curve(y_test, positive_scores)
                fpr_values, tpr_values, _ = roc_curve(y_test, positive_scores)
                metrics["average_precision"] = round(float(average_precision_score(y_test, positive_scores)) * 100, 2)
                metrics["roc_curve"] = [
                    {"fpr": round(float(fpr), 4), "tpr": round(float(tpr), 4)}
                    for fpr, tpr in zip(fpr_values, tpr_values)
                ]
                metrics["precision_recall_curve"] = [
                    {
                        "precision": round(float(precision), 4),
                        "recall": round(float(recall), 4),
                    }
                    for precision, recall in zip(precision_values, recall_values)
                ]
            else:
                metrics["roc_auc"] = round(
                    float(roc_auc_score(y_test, probabilities, multi_class="ovr", average="weighted")) * 100,
                    2,
                )
        except Exception:
            metrics["roc_auc"] = None
    else:
        metrics["roc_auc"] = None

    return {
        "metrics": metrics,
        "predictions": predictions,
        "probabilities": probabilities,
        "prediction_time": prediction_time,
        "roc_curve": metrics.get("roc_curve"),
        "precision_recall_curve": metrics.get("precision_recall_curve"),
    }


def evaluate_regression_model(model, x_test, y_test) -> dict[str, Any]:
    prediction_start = perf_counter()
    predictions = model.predict(x_test)
    prediction_time = perf_counter() - prediction_start

    mse = mean_squared_error(y_test, predictions)
    metrics: dict[str, Any] = {
        "mae": round(float(mean_absolute_error(y_test, predictions)), 4),
        "mse": round(float(mse), 4),
        "rmse": round(float(np.sqrt(mse)), 4),
        "r2_score": round(float(r2_score(y_test, predictions)) * 100, 2),
        "prediction_time": round(float(prediction_time), 4),
    }

    return {
        "metrics": metrics,
        "predictions": predictions,
        "probabilities": None,
        "prediction_time": prediction_time,
    }
