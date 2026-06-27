from typing import Any

from pydantic import BaseModel


class UploadResponse(BaseModel):
    message: str
    filename: str
    rows: int
    columns: int
    file_size: float


class PreviewResponse(BaseModel):
    message: str
    filename: str
    rows: int
    columns: int
    dataset_size: float
    column_names: list[str]
    data_types: dict[str, str]
    missing_values: list[dict[str, Any]]
    rows_preview: list[dict[str, Any]]
    numeric_columns: list[str] | None = None
    correlation_matrix: dict[str, Any] | None = None
    column_summary: list[dict[str, Any]] | None = None
    column_value_counts: dict[str, dict[str, int]] | None = None


class TrainRequest(BaseModel):
    filename: str
    target_column: str


class TrainResponse(BaseModel):
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
    number_of_samples: int | None = None
    number_of_features: int | None = None
    dataset_quality_score: float | None = None
    model_confidence: float | None = None
    model_complexity: str | None = None
    feature_importance: list[dict[str, Any]] | None = None
    explainability: dict[str, Any] | None = None
    roc_curve: list[dict[str, float]] | None = None
    precision_recall_curve: list[dict[str, float]] | None = None
    warnings: list[str] | None = None
    best_practices: list[str] | None = None


class PredictionResponse(BaseModel):
    message: str
    filename: str
    problem_type: str
    total_records: int
    predictions: list[Any]
    probabilities: list[dict[str, float]] | None = None
    prediction_summary: dict[str, Any]
    saved_predictions_path: str
