from typing import Any

from pydantic import BaseModel


class PreprocessRequest(BaseModel):
    filename: str
    target_column: str


class PreprocessResponse(BaseModel):
    message: str
    filename: str
    target_column: str
    feature_names: list[str]
    summary: dict[str, Any]
    cleaned_dataset_preview: list[dict[str, Any]]
    processed_dataset_preview: list[dict[str, Any]]
