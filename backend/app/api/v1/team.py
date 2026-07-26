from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.db.session import get_db
from app.schemas.team import TeamMemberInvite, TeamMemberUpdate, TeamMemberResponse, InviteAcceptRequest
from app.services.team_service import TeamService
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response

router = APIRouter()

def get_org_id(current_user: User = Depends(get_current_active_user)) -> uuid.UUID:
    if not current_user.current_organization_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="No active organization context")
    return current_user.current_organization_id

@router.get("", response_model=StandardResponse[List[TeamMemberResponse]])
async def get_team(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    team_service = TeamService(db)
    members = await team_service.get_team(current_user.id, org_id)
    
    response_data = []
    for member in members:
        # Construct response, extracting email and name from loaded user relationship
        mem_dict = {
            **member.__dict__,
            "email": member.user.email if member.user else None,
            "full_name": member.user.full_name if member.user else None
        }
        response_data.append(TeamMemberResponse.model_validate(mem_dict))
        
    return success_response(data=response_data, message="Team retrieved")

@router.get("/{member_id}", response_model=StandardResponse[TeamMemberResponse])
async def get_member(
    member_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    team_service = TeamService(db)
    member = await team_service.get_member(current_user.id, org_id, member_id)
    
    mem_dict = {
        **member.__dict__,
        "email": member.user.email if member.user else None,
        "full_name": member.user.full_name if member.user else None
    }
    
    return success_response(data=TeamMemberResponse.model_validate(mem_dict), message="Member retrieved")

@router.post("/invite", response_model=StandardResponse[TeamMemberResponse])
async def invite_member(
    invite_in: TeamMemberInvite,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    team_service = TeamService(db)
    member = await team_service.invite_member(current_user.id, org_id, invite_in)
    
    # Reload or mock user data for response
    # For a robust setup, team_service could eagerly load this, but for now we'll pass none for email/name
    return success_response(data=TeamMemberResponse.model_validate(member), message="Member invited")

@router.patch("/{member_id}", response_model=StandardResponse[TeamMemberResponse])
async def update_member(
    member_id: uuid.UUID,
    update_in: TeamMemberUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    team_service = TeamService(db)
    member = await team_service.update_member(current_user.id, org_id, member_id, update_in)
    return success_response(data=TeamMemberResponse.model_validate(member), message="Member updated")

@router.delete("/{member_id}", response_model=StandardResponse)
async def remove_member(
    member_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    team_service = TeamService(db)
    await team_service.remove_member(current_user.id, org_id, member_id)
    return success_response(message="Member removed")

@router.post("/{member_id}/resend-invite", response_model=StandardResponse)
async def resend_invite(
    member_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    team_service = TeamService(db)
    await team_service.resend_invite(current_user.id, org_id, member_id)
    return success_response(message="Invitation resent")

@router.post("/{member_id}/accept", response_model=StandardResponse[TeamMemberResponse])
async def accept_invite(
    member_id: uuid.UUID,
    request: InviteAcceptRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    team_service = TeamService(db)
    member = await team_service.accept_invite(current_user.id, org_id, member_id, request.token)
    return success_response(data=TeamMemberResponse.model_validate(member), message="Invitation accepted")
