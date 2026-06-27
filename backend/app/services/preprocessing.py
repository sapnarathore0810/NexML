from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

from app.utils.helpers import detect_problem_type, is_id_like_column, normalize_filename


@dataclass
class PreprocessResult:
    cleaned_dataset: pd.DataFrame
    processed_dataset: pd.DataFrame
    feature_names: list[str]
    target_name: str
    problem_type: str
    summary: dict[str, Any]
    preprocessor: dict[str, Any]
    target_encoder: LabelEncoder | None
    target_classes: list[str]


def _load_dataset(file_path: Path) -> pd.DataFrame:
    try:
        dataframe = pd.read_csv(file_path)
    except Exception as error:
        raise ValueError("The uploaded CSV is corrupted or unreadable") from error

    if dataframe.empty:
        raise ValueError("The dataset is empty")

    return dataframe


def _detect_column_groups(frame: pd.DataFrame, target_column: str) -> tuple[list[str], list[str]]:
    categorical_columns: list[str] = []
    numerical_columns: list[str] = []

    for column in frame.columns:
        if column == target_column:
            continue

        if pd.api.types.is_numeric_dtype(frame[column]):
            numerical_columns.append(column)
        else:
            categorical_columns.append(column)

    return categorical_columns, numerical_columns


def _remove_constants_and_ids(frame: pd.DataFrame, target_column: str) -> tuple[pd.DataFrame, list[str]]:
    dropped_columns: list[str] = []

    for column in list(frame.columns):
        if column == target_column:
            continue

        if frame[column].nunique(dropna=False) <= 1 or is_id_like_column(column):
            frame = frame.drop(columns=[column])
            dropped_columns.append(column)

    return frame, dropped_columns


def _fill_missing_values(frame: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, Any], int]:
    fill_values: dict[str, Any] = {}
    missing_values_filled = 0

    for column in frame.columns:
        missing_count = int(frame[column].isna().sum())
        if not missing_count:
            continue

        missing_values_filled += missing_count
        if pd.api.types.is_numeric_dtype(frame[column]):
            fill_value = float(frame[column].mean()) if frame[column].notna().any() else 0.0
        else:
            mode_value = frame[column].mode(dropna=True)
            fill_value = mode_value.iloc[0] if not mode_value.empty else "Unknown"

        frame[column] = frame[column].fillna(fill_value)
        fill_values[column] = fill_value

    return frame, fill_values, missing_values_filled


def _encode_features(
    frame: pd.DataFrame,
    categorical_columns: list[str],
) -> tuple[pd.DataFrame, dict[str, Any], list[str], list[str]]:
    binary_encoders: dict[str, Any] = {}
    one_hot_columns: list[str] = []
    feature_names: list[str] = []

    processed = frame.copy()
    for column in categorical_columns:
        unique_values = processed[column].astype(str).unique().tolist()
        if len(unique_values) <= 2:
            classes = sorted(str(value) for value in unique_values)
            mapping = {classes[index]: index for index in range(len(classes))}
            processed[column] = processed[column].astype(str).map(mapping)
            binary_encoders[column] = {"classes": classes, "mapping": mapping}
            feature_names.append(column)
        else:
            dummies = pd.get_dummies(processed[column].astype(str), prefix=column)
            one_hot_columns.extend(dummies.columns.tolist())
            processed = pd.concat([processed.drop(columns=[column]), dummies], axis=1)

    feature_names.extend([column for column in processed.columns if column not in feature_names])
    return processed, binary_encoders, one_hot_columns, feature_names


def preprocess_dataset(filename: str, target_column: str) -> PreprocessResult:
    from app.services.file_service import UPLOAD_DIR

    safe_name = normalize_filename(filename)
    file_path = UPLOAD_DIR / safe_name

    if not file_path.exists():
        raise FileNotFoundError("The uploaded file does not exist")

    dataframe = _load_dataset(file_path)

    if dataframe.shape[1] < 2:
        raise ValueError("The dataset must contain at least two columns")

    if target_column not in dataframe.columns:
        raise ValueError("Selected target column does not exist in the dataset")

    rows_before = int(dataframe.shape[0])

    dataframe = dataframe.drop_duplicates().reset_index(drop=True)
    duplicate_rows_removed = rows_before - int(dataframe.shape[0])

    dataframe, dropped_columns = _remove_constants_and_ids(dataframe, target_column)

    if target_column not in dataframe.columns:
        raise ValueError("Target column was removed during preprocessing")

    cleaned_dataset = dataframe.copy()
    dataframe, fill_values, missing_values_filled = _fill_missing_values(dataframe)

    problem_type = detect_problem_type(dataframe[target_column])
    target_encoder: LabelEncoder | None = None
    target_classes: list[str] = []

    if problem_type == "classification" and not pd.api.types.is_numeric_dtype(dataframe[target_column]):
        target_encoder = LabelEncoder()
        dataframe[target_column] = target_encoder.fit_transform(dataframe[target_column].astype(str))
        target_classes = [str(value) for value in target_encoder.classes_]

    categorical_columns, numerical_columns = _detect_column_groups(dataframe, target_column)
    processed_dataset = dataframe.copy()

    processed_dataset, binary_encoders, one_hot_columns, feature_names = _encode_features(
        processed_dataset,
        categorical_columns,
    )

    numeric_features = [column for column in numerical_columns if column != target_column]
    scaler = None
    if numeric_features:
        scaler = StandardScaler()
        processed_dataset[numeric_features] = scaler.fit_transform(processed_dataset[numeric_features])

    feature_names = [column for column in processed_dataset.columns if column != target_column]

    summary = {
        "Rows Before": rows_before,
        "Rows After": int(processed_dataset.shape[0]),
        "Missing Values Filled": missing_values_filled,
        "Duplicate Rows Removed": duplicate_rows_removed,
        "Categorical Columns Encoded": len(categorical_columns),
        "Scaled Columns": len(numeric_features),
        "Dropped Columns": len(dropped_columns),
        "Problem Type": problem_type,
    }

    preprocessor = {
        "target_column": target_column,
        "problem_type": problem_type,
        "raw_feature_columns": [column for column in cleaned_dataset.columns if column != target_column],
        "fill_values": fill_values,
        "categorical_columns": categorical_columns,
        "numeric_features": numeric_features,
        "binary_encoders": binary_encoders,
        "one_hot_columns": one_hot_columns,
        "scaler": scaler,
        "feature_names": feature_names,
        "dropped_columns": dropped_columns,
        "target_classes": target_classes,
    }

    return PreprocessResult(
        cleaned_dataset=cleaned_dataset,
        processed_dataset=processed_dataset,
        feature_names=feature_names,
        target_name=target_column,
        problem_type=problem_type,
        summary=summary,
        preprocessor=preprocessor,
        target_encoder=target_encoder,
        target_classes=target_classes,
    )


def transform_for_prediction(frame: pd.DataFrame, preprocessor: dict[str, Any]) -> pd.DataFrame:
    required_columns = preprocessor.get("raw_feature_columns", [])
    missing_columns = [column for column in required_columns if column not in frame.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")

    working_frame = frame[required_columns].copy()
    fill_values = preprocessor.get("fill_values", {})

    for column in working_frame.columns:
        if column in fill_values:
            working_frame[column] = working_frame[column].fillna(fill_values[column])
        elif working_frame[column].isna().any():
            if pd.api.types.is_numeric_dtype(working_frame[column]):
                working_frame[column] = working_frame[column].fillna(float(working_frame[column].mean()))
            else:
                mode_value = working_frame[column].mode(dropna=True)
                working_frame[column] = working_frame[column].fillna(mode_value.iloc[0] if not mode_value.empty else "Unknown")

    for column, encoder_data in preprocessor.get("binary_encoders", {}).items():
        mapping = encoder_data.get("mapping", {})
        unknown_values = set(working_frame[column].astype(str).unique()) - set(mapping.keys())
        if unknown_values:
            raise ValueError(f"Unexpected values found in column '{column}': {', '.join(sorted(unknown_values))}")
        working_frame[column] = working_frame[column].astype(str).map(mapping)

    categorical_columns = preprocessor.get("categorical_columns", [])
    multi_category_columns = [column for column in categorical_columns if column not in preprocessor.get("binary_encoders", {})]

    for column in multi_category_columns:
        dummies = pd.get_dummies(working_frame[column].astype(str), prefix=column)
        working_frame = pd.concat([working_frame.drop(columns=[column]), dummies], axis=1)

    expected_dummy_columns = [column for column in preprocessor.get("one_hot_columns", []) if column not in working_frame.columns]
    for column in expected_dummy_columns:
        working_frame[column] = 0

    scaler = preprocessor.get("scaler")
    numeric_features = preprocessor.get("numeric_features", [])
    if scaler is not None and numeric_features:
        working_frame[numeric_features] = scaler.transform(working_frame[numeric_features])

    feature_names = preprocessor.get("feature_names", [])
    transformed = working_frame.reindex(columns=feature_names, fill_value=0)
    return transformed
