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

def get_org_id(current_user: User = Depends(get_current_active_user)) -> uuid.UUID:
    if not current_user.current_organization_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="No active organization context")
    return current_user.current_organization_id

@router.get("/activity", response_model=StandardResponse)
async def get_global_activity(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    filter_type: str = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    service = ActivityService(db)
    # We pass None for project_id to signify global activity across the organization
    items, total = await service.get_project_activity(None, page, limit, filter_type)
    
    return paginated_response(
        items=[ActivityResponse.model_validate(act).model_dump() for act in items],
        total=total,
        page=page,
        limit=limit,
        message="Global activity retrieved"
    )

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
