from pathlib import Path
from shutil import copyfileobj

import pandas as pd
from fastapi import UploadFile

from app.services.audit_logger import log_upload_event

BASE_DIR = Path(__file__).resolve().parents[1]
UPLOAD_DIR = BASE_DIR / "uploads"


def _ensure_upload_dir() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _validate_csv(file: UploadFile) -> None:
    filename = file.filename or ""
    if not filename.lower().endswith(".csv"):
        raise ValueError("Only CSV files are allowed")


async def save_csv_file(file: UploadFile) -> dict:
    _ensure_upload_dir()
    _validate_csv(file)

    safe_name = Path(file.filename or "uploaded.csv").name
    destination = UPLOAD_DIR / safe_name

    file.file.seek(0)
    with destination.open("wb") as output_file:
        copyfileobj(file.file, output_file)

    try:
        dataframe = pd.read_csv(destination)
    except Exception as error:
        destination.unlink(missing_ok=True)
        raise ValueError("The uploaded file could not be parsed as CSV") from error

    log_upload_event(
        filename=safe_name,
        rows=int(dataframe.shape[0]),
        columns=int(dataframe.shape[1]),
        file_size=round(destination.stat().st_size / (1024 * 1024), 2),
    )

    return {
        "message": "Upload Successful",
        "filename": safe_name,
        "rows": int(dataframe.shape[0]),
        "columns": int(dataframe.shape[1]),
        "file_size": round(destination.stat().st_size / (1024 * 1024), 2),
    }


def get_dataset_preview(filename: str) -> dict:
    _ensure_upload_dir()
    safe_name = Path(filename).name
    file_path = UPLOAD_DIR / safe_name

    if not file_path.exists():
        raise FileNotFoundError("Requested dataset was not found")

    try:
        dataframe = pd.read_csv(file_path)
    except Exception as error:
        raise ValueError("Stored file could not be read as CSV") from error

    preview_frame = dataframe.head(10)
    missing_counts = dataframe.isna().sum()

    return {
        "message": "Preview fetched successfully",
        "filename": safe_name,
        "rows": int(dataframe.shape[0]),
        "columns": int(dataframe.shape[1]),
        "dataset_size": round(file_path.stat().st_size / (1024 * 1024), 2),
        "column_names": list(dataframe.columns),
        "data_types": {column: str(dtype) for column, dtype in dataframe.dtypes.items()},
        "missing_values": [
            {
                "column": column,
                "count": int(count),
                "percentage": round((count / len(dataframe) * 100) if len(dataframe) else 0, 2),
            }
            for column, count in missing_counts.items()
        ],
        "rows_preview": preview_frame.fillna("").to_dict(orient="records"),
        "numeric_columns": [column for column in dataframe.columns if pd.api.types.is_numeric_dtype(dataframe[column])],
        "correlation_matrix": dataframe.select_dtypes(include="number").corr().fillna(0).round(4).to_dict()
        if len(dataframe.select_dtypes(include="number").columns) >= 2
        else {},
        "column_summary": [
            {
                "column": column,
                "dtype": str(dtype),
                "missing": int(dataframe[column].isna().sum()),
                "unique": int(dataframe[column].nunique(dropna=True)),
            }
            for column, dtype in dataframe.dtypes.items()
        ],
        "column_value_counts": {
            column: {
                str(value): int(count)
                for value, count in dataframe[column].value_counts(dropna=False).head(10).items()
            }
            for column in dataframe.columns
        },
    }