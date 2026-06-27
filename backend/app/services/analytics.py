from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd

try:  # optional dependency
    import shap  # type: ignore
except Exception:  # pragma: no cover
    shap = None


def _coerce_feature_values(values: Any, feature_count: int) -> np.ndarray:
    array = np.asarray(values, dtype=float)
    if array.ndim == 0:
        return np.zeros(feature_count, dtype=float)
    if array.ndim == 1:
        return array
    if array.ndim == 2:
        return np.mean(np.abs(array), axis=0)
    if array.ndim >= 3:
        reshaped = np.mean(np.abs(array), axis=0)
        return np.asarray(reshaped).reshape(-1)[:feature_count]
    return np.zeros(feature_count, dtype=float)


def build_feature_importance(model, feature_names: list[str]) -> list[dict[str, Any]]:
    if not feature_names:
        return []

    raw_values: np.ndarray | None = None

    if hasattr(model, "feature_importances_"):
        raw_values = np.asarray(model.feature_importances_, dtype=float)
    elif hasattr(model, "coef_"):
        coefficients = np.asarray(model.coef_, dtype=float)
        if coefficients.ndim > 1:
            coefficients = np.mean(np.abs(coefficients), axis=0)
        else:
            coefficients = np.abs(coefficients)
        raw_values = coefficients

    if raw_values is None or raw_values.size == 0:
        return []

    raw_values = np.asarray(raw_values).reshape(-1)
    if raw_values.size != len(feature_names):
        raw_values = raw_values[: len(feature_names)]

    total = float(np.sum(np.abs(raw_values))) or 1.0
    ranked = sorted(
        (
            {
                "feature": feature_name,
                "importance": round(float(abs(value)) / total * 100, 2),
            }
            for feature_name, value in zip(feature_names, raw_values, strict=False)
        ),
        key=lambda item: item["importance"],
        reverse=True,
    )
    return ranked[:15]


def build_model_complexity(model) -> str:
    if hasattr(model, "n_estimators"):
        n_estimators = getattr(model, "n_estimators", None)
        if isinstance(n_estimators, int):
            if n_estimators <= 75:
                return f"Low complexity ({n_estimators} estimators)"
            if n_estimators <= 200:
                return f"Medium complexity ({n_estimators} estimators)"
            return f"High complexity ({n_estimators} estimators)"
        return "Medium complexity"

    if hasattr(model, "coef_"):
        return "Low complexity linear model"

    return "Moderate complexity"


def build_dataset_quality_score(summary: dict[str, Any], rows: int, columns: int) -> float:
    if rows <= 0 or columns <= 0:
        return 0.0

    missing_penalty = min(35.0, float(summary.get("Missing Values Filled", 0)) / max(rows, 1) * 100 * 0.35)
    duplicate_penalty = min(20.0, float(summary.get("Duplicate Rows Removed", 0)) / max(rows, 1) * 100 * 0.2)
    drop_penalty = min(15.0, float(summary.get("Dropped Columns", 0)) * 2.5)
    score = 100.0 - missing_penalty - duplicate_penalty - drop_penalty
    return round(max(0.0, min(100.0, score)), 2)


def build_explainability_payload(
    model,
    feature_names: list[str],
    x_train: pd.DataFrame,
    x_test: pd.DataFrame,
) -> dict[str, Any]:
    fallback_importance = build_feature_importance(model, feature_names)
    fallback_local = fallback_importance[:8]

    if shap is None:
        return {
            "supported": False,
            "mode": "fallback",
            "message": "SHAP is not installed, so the app is using model-based feature importance as a fallback.",
            "global_feature_importance": fallback_importance,
            "summary_plot": fallback_importance[:10],
            "local_prediction": {
                "label": "Fallback explanation",
                "features": fallback_local,
            },
            "waterfall_plot": fallback_local,
        }

    if x_train.empty or x_test.empty or not feature_names:
        return {
            "supported": False,
            "mode": "fallback",
            "message": "Not enough samples were available for SHAP. The app is showing a fallback explanation.",
            "global_feature_importance": fallback_importance,
            "summary_plot": fallback_importance[:10],
            "local_prediction": {
                "label": "Fallback explanation",
                "features": fallback_local,
            },
            "waterfall_plot": fallback_local,
        }

    try:
        background = x_train.sample(n=min(50, len(x_train)), random_state=42)
        test_sample = x_test.sample(n=min(1, len(x_test)), random_state=42)
        explainer = shap.Explainer(model, background)
        explanation = explainer(test_sample)
        values = np.asarray(explanation.values)
        test_row = test_sample.iloc[0].to_dict()

        if values.ndim == 3:
            values = np.mean(values, axis=1)
        if values.ndim == 2:
            local_values = values[0]
        else:
            local_values = values.reshape(-1)

        local_pairs = []
        for index, feature_name in enumerate(feature_names[: len(local_values)]):
            impact = float(local_values[index])
            local_pairs.append(
                {
                    "feature": feature_name,
                    "value": round(float(test_row.get(feature_name, 0.0)), 4) if feature_name in test_row else 0.0,
                    "impact": round(impact, 6),
                    "direction": "positive" if impact >= 0 else "negative",
                }
            )

        global_importance = _coerce_feature_values(np.abs(values), len(feature_names))
        total = float(np.sum(global_importance)) or 1.0
        ranked_importance = sorted(
            (
                {
                    "feature": feature_name,
                    "importance": round(float(global_value) / total * 100, 2),
                }
                for feature_name, global_value in zip(feature_names, global_importance, strict=False)
            ),
            key=lambda item: item["importance"],
            reverse=True,
        )

        return {
            "supported": True,
            "mode": "shap",
            "message": "SHAP explanations are available for the selected model.",
            "global_feature_importance": ranked_importance[:15],
            "summary_plot": ranked_importance[:10],
            "local_prediction": {
                "label": "Local prediction explanation",
                "features": local_pairs[:10],
            },
            "waterfall_plot": local_pairs[:10],
        }
    except Exception:
        return {
            "supported": False,
            "mode": "fallback",
            "message": "SHAP could not analyze this model, so the app is using the fallback explanation.",
            "global_feature_importance": fallback_importance,
            "summary_plot": fallback_importance[:10],
            "local_prediction": {
                "label": "Fallback explanation",
                "features": fallback_local,
            },
            "waterfall_plot": fallback_local,
        }