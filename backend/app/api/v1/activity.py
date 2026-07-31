from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response, paginated_response
from app.schemas.activity import ActivityResponse
from app.services.activity_service import ActivityService
import uuid
from fastapi import Query

router = APIRouter()

@router.get("/{project_id}/activity", response_model=StandardResponse)
async def get_activity(
    project_id: uuid.UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    filter_type: str = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # In a real app, verify user has access to this project
    service = ActivityService(db)
    items, total = await service.get_project_activity(project_id, page, limit, filter_type)
    
    # We serialize it back manually if needed, or rely on paginated_response
    return paginated_response(
        items=[ActivityResponse.model_validate(act).model_dump() for act in items],
        total=total,
        page=page,
        limit=limit,
        message="Activity retrieved"
    )
