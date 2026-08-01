from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response
from typing import Any

router = APIRouter()

@router.get("", response_model=StandardResponse[Any])
async def get_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    from app.repositories.organization_repository import OrganizationRepository
    
    org_repo = OrganizationRepository(db)
    org_data = {}
    if current_user.current_organization_id:
        org = await org_repo.get_by_id(current_user.current_organization_id)
        if org:
            org_data = {
                "id": str(org.id),
                "name": org.name,
                "industry": getattr(org, "industry", ""),
                "website": getattr(org, "website", ""),
                "description": getattr(org, "description", "")
            }
            
    return success_response(data=org_data, message="Settings retrieved")
