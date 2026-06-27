from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Any

import joblib

BASE_DIR = Path(__file__).resolve().parents[1]
SAVED_MODELS_DIR = BASE_DIR / "saved_models"
REPORTS_DIR = BASE_DIR / "reports"
LOGS_DIR = BASE_DIR / "logs"

MODEL_PATH = SAVED_MODELS_DIR / "model.pkl"
METRICS_PATH = SAVED_MODELS_DIR / "metrics.json"
PREPROCESSING_REPORT_PATH = REPORTS_DIR / "preprocessing-report.txt"
TRAINING_REPORT_PATH = REPORTS_DIR / "training-report.pdf"
PREDICTIONS_PATH = REPORTS_DIR / "predictions.csv"


def ensure_artifact_dirs() -> None:
    SAVED_MODELS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)


def save_model_package(package: dict[str, Any]) -> Path:
    ensure_artifact_dirs()
    joblib.dump(package, MODEL_PATH)
    return MODEL_PATH


def load_model_package() -> dict[str, Any]:
    if not MODEL_PATH.exists():
        raise FileNotFoundError("No trained model was found")

    package = joblib.load(MODEL_PATH)
    if not isinstance(package, dict):
        raise ValueError("Stored model artifact is invalid")
    return package


def save_json_like_file(path: Path, content: str) -> Path:
    ensure_artifact_dirs()
    path.write_text(content, encoding="utf-8")
    return path


def artifact_timestamp() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
