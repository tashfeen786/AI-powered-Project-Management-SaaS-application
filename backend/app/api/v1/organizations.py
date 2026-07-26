from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.db.session import get_db
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationResponse, SwitchOrganizationRequest
from app.services.organization_service import OrganizationService
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response

router = APIRouter()

@router.get("", response_model=StandardResponse[List[OrganizationResponse]])
async def get_my_organizations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_service = OrganizationService(db)
    orgs = await org_service.get_my_organizations(current_user.id)
    return success_response(
        data=[OrganizationResponse.model_validate(org) for org in orgs],
        message="Organizations retrieved"
    )

@router.post("", response_model=StandardResponse[OrganizationResponse])
async def create_organization(
    org_in: OrganizationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_service = OrganizationService(db)
    org = await org_service.create_organization(current_user.id, org_in)
    return success_response(
        data=OrganizationResponse.model_validate(org),
        message="Organization created successfully"
    )

@router.get("/current", response_model=StandardResponse[OrganizationResponse])
async def get_current_organization(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_service = OrganizationService(db)
    org = await org_service.get_current_organization(current_user.id)
    return success_response(
        data=OrganizationResponse.model_validate(org),
        message="Current organization retrieved"
    )

@router.patch("/{org_id}", response_model=StandardResponse[OrganizationResponse])
async def update_organization(
    org_id: uuid.UUID,
    org_in: OrganizationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_service = OrganizationService(db)
    org = await org_service.update_organization(current_user.id, org_id, org_in)
    return success_response(
        data=OrganizationResponse.model_validate(org),
        message="Organization updated successfully"
    )

@router.post("/switch", response_model=StandardResponse[OrganizationResponse])
async def switch_organization(
    request: SwitchOrganizationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_service = OrganizationService(db)
    org = await org_service.switch_organization(current_user.id, request.organization_id)
    return success_response(
        data=OrganizationResponse.model_validate(org),
        message="Switched organization successfully"
    )
