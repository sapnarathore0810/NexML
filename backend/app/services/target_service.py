def select_target(target_column: str) -> dict:
    problem_type = "classification" if target_column.lower() in {"gender", "purchased", "education"} else "regression"

    return {
        "message": "Target column selected successfully",
        "selected_target": target_column,
        "problem_type": problem_type,
        "target_info": {
            "data_type": "Category" if problem_type == "classification" else "Integer",
            "unique_values": 2 if problem_type == "classification" else 28,
            "missing_values": 6,
        },
    }