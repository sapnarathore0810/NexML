from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.services.model_manager import LOGS_DIR, ensure_artifact_dirs

UPLOAD_LOG_PATH = LOGS_DIR / "uploads.log"
TRAINING_LOG_PATH = LOGS_DIR / "training.log"
PREDICTION_LOG_PATH = LOGS_DIR / "prediction.log"
ERROR_LOG_PATH = LOGS_DIR / "errors.log"


def _append_event(path: Path, event_type: str, payload: dict[str, Any]) -> None:
    ensure_artifact_dirs()
    event = {
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **payload,
    }
    with path.open("a", encoding="utf-8") as log_file:
        log_file.write(json.dumps(event, default=str) + "\n")


def log_upload_event(**payload: Any) -> None:
    _append_event(UPLOAD_LOG_PATH, "upload", payload)


def log_training_event(**payload: Any) -> None:
    _append_event(TRAINING_LOG_PATH, "training", payload)


def log_prediction_event(**payload: Any) -> None:
    _append_event(PREDICTION_LOG_PATH, "prediction", payload)


def log_error_event(**payload: Any) -> None:
    _append_event(ERROR_LOG_PATH, "error", payload)