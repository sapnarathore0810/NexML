from fastapi import UploadFile


async def handle_upload(file: UploadFile) -> dict:
    return {
        "message": "Upload Successful",
        "filename": file.filename,
        "content_type": file.content_type,
    }