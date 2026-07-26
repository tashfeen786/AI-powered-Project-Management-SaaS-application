from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response
from typing import Any

router = APIRouter()

@router.get("/{project_id}/tasks", response_model=StandardResponse[Any])
async def get_tasks(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return success_response(data=[], message="Tasks retrieved")
