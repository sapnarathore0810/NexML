from __future__ import annotations

from pathlib import Path

import pandas as pd


def is_id_like_column(column_name: str) -> bool:
    normalized = column_name.strip().lower()
    return any(
        token in normalized
        for token in ["id", "_id", "id_", "customer_id", "serial_no", "roll_no", "roll_number"]
    )


def normalize_filename(filename: str) -> str:
    return Path(filename).name


def detect_problem_type(target_series: pd.Series) -> str:
    if pd.api.types.is_numeric_dtype(target_series):
        return "regression"
    return "classification"
