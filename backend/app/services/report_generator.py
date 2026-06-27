from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.services.model_manager import (
    PREPROCESSING_REPORT_PATH,
    REPORTS_DIR,
    TRAINING_REPORT_PATH,
    save_json_like_file,
)


def _escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def _build_simple_pdf(lines: list[str], output_path: Path) -> Path:
    lines = [line for line in lines if line is not None]
    content_lines = ["BT", "/F1 11 Tf", "72 770 Td"]

    for index, line in enumerate(lines):
        safe_line = _escape_pdf_text(str(line))
        if index == 0:
            content_lines.append(f"({safe_line}) Tj")
        else:
            content_lines.append("T*")
            content_lines.append(f"({safe_line}) Tj")

    content_lines.append("ET")
    content_stream = "\n".join(content_lines).encode("latin-1", errors="ignore")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length %d >>\nstream\n" % len(content_stream) + content_stream + b"\nendstream",
    ]

    pdf = bytearray(b"%PDF-1.4\n")
    offsets = [0]

    for index, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{index} 0 obj\n".encode("ascii"))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    xref_position = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    pdf.extend(
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_position}\n%%EOF".encode(
            "ascii"
        )
    )

    output_path.write_bytes(pdf)
    return output_path


def generate_preprocessing_report(summary: dict[str, Any]) -> Path:
    report_lines = ["NexML Preprocessing Report", ""]
    for key, value in summary.items():
        report_lines.append(f"{key}: {value}")
    return save_json_like_file(PREPROCESSING_REPORT_PATH, "\n".join(report_lines))


def generate_training_report(report_data: dict[str, Any]) -> tuple[Path, Path]:
    text_lines = ["NexML AutoML Training Report", ""]
    for key in ["problem_type", "best_model", "best_reason", "training_time", "prediction_time", "recommendation"]:
        if key in report_data:
            text_lines.append(f"{key.replace('_', ' ').title()}: {report_data[key]}")

    text_lines.append("")
    text_lines.append("Best Parameters:")
    text_lines.append(json.dumps(report_data.get("best_parameters", {}), indent=2))
    text_lines.append("")
    text_lines.append("Metrics:")
    text_lines.append(json.dumps(report_data.get("best_metrics", {}), indent=2))
    text_lines.append("")
    text_lines.append("Models Trained:")
    for row in report_data.get("comparison_table", []):
        text_lines.append(f"- {row.get('model')}: {row}")

    txt_path = save_json_like_file(REPORTS_DIR / "training-report.txt", "\n".join(text_lines))
    pdf_path = _build_simple_pdf(text_lines, TRAINING_REPORT_PATH)
    return txt_path, pdf_path


def generate_recommendation(problem_type: str, best_model: str, best_metrics: dict[str, Any]) -> str:
    if problem_type == "classification":
        return f"{best_model} is recommended because it delivered the strongest classification balance across accuracy, precision, recall, and F1."
    return f"{best_model} is recommended because it produced the strongest regression fit with the best error profile and R2 score."
