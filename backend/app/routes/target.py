from fastapi import APIRouter
from pydantic import BaseModel

from app.services.target_service import select_target

router = APIRouter(tags=["Target"])


class TargetSelectionRequest(BaseModel):
    target_column: str


@router.post("/select-target")
async def select_target_column(payload: TargetSelectionRequest) -> dict:
    return select_target(payload.target_column)