from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response
from app.services.analytics_service import AnalyticsService
from app.models.user_organization import UserOrganization
from sqlalchemy import select
from typing import Any
from fastapi import HTTPException

router = APIRouter()

@router.get("", response_model=StandardResponse[Any])
async def get_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Determine the organization for the user
    res = await db.execute(
        select(UserOrganization.organization_id)
        .where(UserOrganization.user_id == current_user.id)
        .limit(1)
    )
    org_id = res.scalar()
    if not org_id:
        raise HTTPException(status_code=403, detail="User does not belong to any organization")

    service = AnalyticsService(db)
    data = await service.get_dashboard_analytics(org_id)
    
    return success_response(data=data, message="Analytics retrieved successfully")
