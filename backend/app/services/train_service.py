from __future__ import annotations

import json
from dataclasses import dataclass
from time import perf_counter
from typing import Any

import pandas as pd
from sklearn.ensemble import (
    AdaBoostClassifier,
    AdaBoostRegressor,
    ExtraTreesClassifier,
    ExtraTreesRegressor,
    GradientBoostingClassifier,
    GradientBoostingRegressor,
    RandomForestClassifier,
    RandomForestRegressor,
)
from sklearn.linear_model import ElasticNet, Lasso, LinearRegression, LogisticRegression, Ridge
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC, SVR
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

try:  # optional dependency
    from xgboost import XGBClassifier, XGBRegressor  # type: ignore
except Exception:  # pragma: no cover
    XGBClassifier = None
    XGBRegressor = None

from app.services.analytics import (
    build_dataset_quality_score,
    build_explainability_payload,
    build_feature_importance,
    build_model_complexity,
)
from app.services.audit_logger import log_training_event
from app.services.evaluation import evaluate_classification_model, evaluate_regression_model
from app.services.model_manager import METRICS_PATH, artifact_timestamp, save_json_like_file, save_model_package
from app.services.preprocessing import preprocess_dataset
from app.services.report_generator import generate_preprocessing_report, generate_recommendation, generate_training_report


@dataclass
class TrainingResult:
    message: str
    filename: str
    target_column: str
    problem_type: str
    best_model: str
    best_reason: str
    best_parameters: dict[str, Any]
    best_metrics: dict[str, Any]
    comparison_table: list[dict[str, Any]]
    training_time: float
    prediction_time: float
    saved_model_path: str
    metrics_path: str
    preprocessing_report_path: str
    training_report_path: str
    recommendation: str
    activity_log: list[dict[str, str]]
    target_classes: list[str]
    number_of_samples: int
    number_of_features: int
    dataset_quality_score: float
    model_confidence: float | None
    model_complexity: str
    feature_importance: list[dict[str, Any]]
    explainability: dict[str, Any]
    roc_curve: list[dict[str, float]] | None
    precision_recall_curve: list[dict[str, float]] | None
    warnings: list[str]
    best_practices: list[str]


def _build_classification_models() -> dict[str, Any]:
    models = {
        "Logistic Regression": LogisticRegression(max_iter=2000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(random_state=42, n_estimators=200),
        "KNN": KNeighborsClassifier(),
        "SVM": SVC(probability=True, random_state=42),
        "Naive Bayes": GaussianNB(),
        "Gradient Boosting": GradientBoostingClassifier(random_state=42),
        "AdaBoost": AdaBoostClassifier(random_state=42),
        "Extra Trees": ExtraTreesClassifier(random_state=42, n_estimators=200),
    }
    if XGBClassifier is not None:
        models["XGBoost"] = XGBClassifier(random_state=42, eval_metric="logloss", tree_method="hist", verbosity=0)
    return models


def _build_regression_models() -> dict[str, Any]:
    models = {
        "Linear Regression": LinearRegression(),
        "Decision Tree Regressor": DecisionTreeRegressor(random_state=42),
        "Random Forest Regressor": RandomForestRegressor(random_state=42, n_estimators=200),
        "SVR": SVR(),
        "Gradient Boosting Regressor": GradientBoostingRegressor(random_state=42),
        "Extra Trees Regressor": ExtraTreesRegressor(random_state=42, n_estimators=200),
        "Ridge": Ridge(),
        "Lasso": Lasso(max_iter=5000),
        "ElasticNet": ElasticNet(max_iter=5000),
    }
    if XGBRegressor is not None:
        models["XGBoost Regressor"] = XGBRegressor(random_state=42, tree_method="hist", verbosity=0)
    return models


def _parameter_spaces() -> dict[str, dict[str, list[Any]]]:
    return {
        "Logistic Regression": {"C": [0.1, 1.0, 5.0, 10.0], "solver": ["lbfgs", "liblinear"]},
        "Decision Tree": {"max_depth": [3, 5, 10, None], "min_samples_split": [2, 5, 10]},
        "Random Forest": {"n_estimators": [100, 200, 300], "max_depth": [None, 10, 20]},
        "KNN": {"n_neighbors": [3, 5, 7, 9], "weights": ["uniform", "distance"]},
        "SVM": {"C": [0.5, 1.0, 5.0], "kernel": ["rbf", "linear"]},
        "Naive Bayes": {},
        "Gradient Boosting": {"n_estimators": [100, 150, 200], "learning_rate": [0.01, 0.05, 0.1]},
        "AdaBoost": {"n_estimators": [50, 100, 150], "learning_rate": [0.01, 0.1, 1.0]},
        "Extra Trees": {"n_estimators": [100, 200, 300], "max_depth": [None, 10, 20]},
        "XGBoost": {"n_estimators": [100, 200, 300], "learning_rate": [0.01, 0.05, 0.1]},
        "Linear Regression": {},
        "Decision Tree Regressor": {"max_depth": [3, 5, 10, None], "min_samples_split": [2, 5, 10]},
        "Random Forest Regressor": {"n_estimators": [100, 200, 300], "max_depth": [None, 10, 20]},
        "SVR": {"C": [0.5, 1.0, 5.0], "kernel": ["rbf", "linear"]},
        "Gradient Boosting Regressor": {"n_estimators": [100, 150, 200], "learning_rate": [0.01, 0.05, 0.1]},
        "Extra Trees Regressor": {"n_estimators": [100, 200, 300], "max_depth": [None, 10, 20]},
        "XGBoost Regressor": {"n_estimators": [100, 200, 300], "learning_rate": [0.01, 0.05, 0.1]},
        "Ridge": {"alpha": [0.1, 1.0, 10.0]},
        "Lasso": {"alpha": [0.001, 0.01, 0.1]},
        "ElasticNet": {"alpha": [0.001, 0.01, 0.1], "l1_ratio": [0.2, 0.5, 0.8]},
    }


def _select_best_row(rows: list[dict[str, Any]], problem_type: str) -> dict[str, Any]:
    if problem_type == "classification":
        return sorted(rows, key=lambda row: (-row["accuracy"], -row["f1_score"], row["training_time"]))[0]
    return sorted(rows, key=lambda row: (-row["r2_score"], row["rmse"], row["training_time"]))[0]


def _train_candidate(name: str, model, x_train, x_test, y_train, y_test, problem_type: str) -> dict[str, Any]:
    start_time = perf_counter()
    model.fit(x_train, y_train)
    training_time = perf_counter() - start_time

    if problem_type == "classification":
        evaluation = evaluate_classification_model(model, x_test, y_test)
        metrics = evaluation["metrics"]
        return {
            "model": name,
            "estimator": model,
            "training_time": round(training_time, 4),
            "prediction_time": evaluation["prediction_time"],
            "accuracy": metrics["accuracy"],
            "precision": metrics["precision"],
            "recall": metrics["recall"],
            "f1_score": metrics["f1_score"],
            "roc_auc": metrics["roc_auc"],
            "confusion_matrix": metrics["confusion_matrix"],
        }

    evaluation = evaluate_regression_model(model, x_test, y_test)
    metrics = evaluation["metrics"]
    return {
        "model": name,
        "estimator": model,
        "training_time": round(training_time, 4),
        "prediction_time": evaluation["prediction_time"],
        "mae": metrics["mae"],
        "mse": metrics["mse"],
        "rmse": metrics["rmse"],
        "r2_score": metrics["r2_score"],
    }


def _tune_best_model(name: str, model, x_train, y_train, problem_type: str) -> tuple[Any, dict[str, Any]]:
    parameter_spaces = _parameter_spaces().get(name, {})
    if not parameter_spaces:
        return model, {}

    search = RandomizedSearchCV(
        estimator=model,
        param_distributions=parameter_spaces,
        n_iter=min(6, max(1, len(parameter_spaces))),
        cv=3,
        random_state=42,
        n_jobs=-1,
        scoring="accuracy" if problem_type == "classification" else "r2",
    )
    search.fit(x_train, y_train)
    return search.best_estimator_, search.best_params_


def run_training(filename: str, target_column: str) -> TrainingResult:
    preprocess_result = preprocess_dataset(filename, target_column)
    x = preprocess_result.processed_dataset.drop(columns=[target_column])
    y = preprocess_result.processed_dataset[target_column]

    if preprocess_result.problem_type == "classification" and preprocess_result.target_encoder is not None:
        y = pd.Series(preprocess_result.target_encoder.transform(y.astype(str)), name=target_column)

    stratify = y if preprocess_result.problem_type == "classification" and y.nunique() > 1 else None
    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
        stratify=stratify,
    )

    candidate_models = _build_classification_models() if preprocess_result.problem_type == "classification" else _build_regression_models()

    comparison_rows: list[dict[str, Any]] = []
    trained_candidates: list[dict[str, Any]] = []

    for model_name, model in candidate_models.items():
        candidate = _train_candidate(model_name, model, x_train, x_test, y_train, y_test, preprocess_result.problem_type)
        trained_candidates.append(candidate)

        if preprocess_result.problem_type == "classification":
            comparison_rows.append(
                {
                    "model": model_name,
                    "accuracy": candidate["accuracy"],
                    "precision": candidate["precision"],
                    "recall": candidate["recall"],
                    "f1": candidate["f1_score"],
                    "training_time": candidate["training_time"],
                    "status": "Evaluated",
                }
            )
        else:
            comparison_rows.append(
                {
                    "model": model_name,
                    "mae": candidate["mae"],
                    "mse": candidate["mse"],
                    "rmse": candidate["rmse"],
                    "r2_score": candidate["r2_score"],
                    "training_time": candidate["training_time"],
                    "status": "Evaluated",
                }
            )

    best_row = _select_best_row(comparison_rows, preprocess_result.problem_type)
    best_candidate = next(candidate for candidate in trained_candidates if candidate["model"] == best_row["model"])

    tuned_model, best_parameters = _tune_best_model(
        best_row["model"],
        best_candidate["estimator"],
        x_train,
        y_train,
        preprocess_result.problem_type,
    )

    tuning_start = perf_counter()
    tuned_model.fit(x_train, y_train)
    tuning_training_time = perf_counter() - tuning_start

    if preprocess_result.problem_type == "classification":
        tuned_evaluation = evaluate_classification_model(tuned_model, x_test, y_test)
        best_metrics = tuned_evaluation["metrics"]
        prediction_time = float(best_metrics["prediction_time"])
        best_reason = "Selected because it delivered the strongest classification score among the evaluated models and remained stable after tuning."
    else:
        tuned_evaluation = evaluate_regression_model(tuned_model, x_test, y_test)
        best_metrics = tuned_evaluation["metrics"]
        prediction_time = float(best_metrics["prediction_time"])
        best_reason = "Selected because it achieved the strongest regression fit with the best error profile and was refined through tuning."

    recommendation = generate_recommendation(preprocess_result.problem_type, best_row["model"], best_metrics)
    feature_importance = build_feature_importance(tuned_model, preprocess_result.feature_names)
    explainability = build_explainability_payload(tuned_model, preprocess_result.feature_names, x_train, x_test)
    model_complexity = build_model_complexity(tuned_model)
    dataset_quality_score = build_dataset_quality_score(preprocess_result.summary, len(preprocess_result.processed_dataset), len(preprocess_result.processed_dataset.columns))
    model_confidence = (
        float(best_metrics.get("accuracy"))
        if preprocess_result.problem_type == "classification"
        else float(best_metrics.get("r2_score"))
    )
    warnings: list[str] = []
    if preprocess_result.summary.get("Missing Values Filled", 0):
        warnings.append("Missing values were detected and filled during preprocessing.")
    if preprocess_result.summary.get("Duplicate Rows Removed", 0):
        warnings.append("Duplicate rows were removed before training.")
    if preprocess_result.problem_type == "classification" and best_metrics.get("accuracy", 0) < 80:
        warnings.append("Classification accuracy is below the preferred production threshold.")
    if preprocess_result.problem_type == "regression" and best_metrics.get("r2_score", 0) < 70:
        warnings.append("Regression fit may need additional feature engineering before deployment.")

    best_practices = [
        "Keep the training dataset representative of production traffic.",
        "Review the preprocessing report before retraining with a new file.",
        "Re-run training after adding new features or collecting more data.",
    ]

    model_package = {
        "model": tuned_model,
        "problem_type": preprocess_result.problem_type,
        "target_column": target_column,
        "preprocessor": preprocess_result.preprocessor,
        "target_classes": preprocess_result.target_classes,
        "best_model": best_row["model"],
        "best_parameters": best_parameters,
        "best_metrics": best_metrics,
        "comparison_table": comparison_rows,
        "created_at": artifact_timestamp(),
    }
    saved_model_path = save_model_package(model_package)

    preprocessing_report_path = generate_preprocessing_report(preprocess_result.summary)

    report_payload = {
        "problem_type": preprocess_result.problem_type,
        "best_model": best_row["model"],
        "best_reason": best_reason,
        "training_time": round(float(tuning_training_time), 4),
        "prediction_time": prediction_time,
        "recommendation": recommendation,
        "best_parameters": best_parameters,
        "best_metrics": best_metrics,
        "comparison_table": comparison_rows,
    }
    _, training_report_path = generate_training_report(report_payload)

    metrics_payload = {
        "problem_type": preprocess_result.problem_type,
        "best_model": best_row["model"],
        "best_parameters": best_parameters,
        "best_metrics": best_metrics,
        "comparison_table": comparison_rows,
        "saved_model_path": str(saved_model_path),
        "generated_at": artifact_timestamp(),
    }
    save_json_like_file(METRICS_PATH, json.dumps(metrics_payload, indent=2))

    activity_log = [
        {"timestamp": artifact_timestamp(), "message": "Dataset loaded"},
        {"timestamp": artifact_timestamp(), "message": "Preprocessing completed"},
        {"timestamp": artifact_timestamp(), "message": f"Best model selected: {best_row['model']}"},
        {"timestamp": artifact_timestamp(), "message": "Model saved to disk"},
    ]

    log_training_event(
        filename=filename,
        target_column=target_column,
        problem_type=preprocess_result.problem_type,
        best_model=best_row["model"],
        training_time=round(float(tuning_training_time), 4),
        prediction_time=prediction_time,
        dataset_quality_score=dataset_quality_score,
    )

    return TrainingResult(
        message="AutoML training completed successfully",
        filename=filename,
        target_column=target_column,
        problem_type=preprocess_result.problem_type,
        best_model=best_row["model"],
        best_reason=best_reason,
        best_parameters=best_parameters,
        best_metrics=best_metrics,
        comparison_table=comparison_rows,
        training_time=round(float(tuning_training_time), 4),
        prediction_time=prediction_time,
        saved_model_path=str(saved_model_path),
        metrics_path=str(METRICS_PATH),
        preprocessing_report_path=str(preprocessing_report_path),
        training_report_path=str(training_report_path),
        recommendation=recommendation,
        activity_log=activity_log,
        target_classes=preprocess_result.target_classes,
        number_of_samples=len(preprocess_result.processed_dataset),
        number_of_features=len(preprocess_result.feature_names),
        dataset_quality_score=dataset_quality_score,
        model_confidence=model_confidence,
        model_complexity=model_complexity,
        feature_importance=feature_importance,
        explainability=explainability,
        roc_curve=tuned_evaluation.get("roc_curve"),
        precision_recall_curve=tuned_evaluation.get("precision_recall_curve"),
        warnings=warnings,
        best_practices=best_practices,
    )