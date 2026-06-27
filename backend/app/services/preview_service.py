def get_dataset_info() -> dict:
    return {
        "message": "Dataset preview fetched successfully",
        "summary": {
            "rows": 12450,
            "columns": 18,
            "missing_values": 2,
            "dataset_size": "4.2 MB",
        },
        "columns": ["Age", "Salary", "Gender", "Purchased", "Education", "Experience"],
        "rows_preview": [
            {"Age": 22, "Salary": 54000, "Gender": "Female", "Purchased": "Yes"},
            {"Age": 29, "Salary": 72000, "Gender": "Male", "Purchased": "No"},
        ],
        "missing_values": [
            {"column": "Age", "count": 8, "percentage": 1.2},
            {"column": "Salary", "count": 12, "percentage": 1.8},
        ],
    }