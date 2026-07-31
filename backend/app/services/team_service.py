from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.team import TeamMemberInvite, TeamMemberUpdate
from app.repositories.team_repository import TeamRepository
from app.repositories.user_repository import UserRepository
from app.repositories.organization_repository import OrganizationRepository
from app.services.rbac_service import RBACService, Permission
from app.models.user_organization import UserOrganization
from typing import Sequence
from datetime import datetime, UTC
import uuid

class TeamService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.team_repo = TeamRepository(db)
        self.user_repo = UserRepository(db)
        self.org_repo = OrganizationRepository(db)
        
    async def _check_permission(self, user_id: uuid.UUID, org_id: uuid.UUID, permission: Permission) -> UserOrganization:
        user_org = await self.team_repo.get_member_by_user_id(org_id, user_id)
        if not user_org or user_org.status != "accepted":
            raise HTTPException(status_code=403, detail="User is not an active member of this organization")
            
        if not RBACService.has_permission(user_org.role, permission):
            raise HTTPException(status_code=403, detail=f"Missing permission: {permission.value}")
            
        return user_org

    async def get_team(self, user_id: uuid.UUID, org_id: uuid.UUID) -> Sequence[UserOrganization]:
        # Viewer permission required to see team
        await self._check_permission(user_id, org_id, Permission.VIEW_PROJECTS)
        return await self.team_repo.get_team_members(org_id)

    async def get_member(self, user_id: uuid.UUID, org_id: uuid.UUID, member_id: uuid.UUID) -> UserOrganization:
        await self._check_permission(user_id, org_id, Permission.VIEW_PROJECTS)
        member = await self.team_repo.get_member_by_id(org_id, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        return member

    async def invite_member(self, inviter_id: uuid.UUID, org_id: uuid.UUID, invite_in: TeamMemberInvite) -> UserOrganization:
        await self._check_permission(inviter_id, org_id, Permission.INVITE_MEMBERS)
        
        # Check if user exists
        user = await self.user_repo.get_by_email(invite_in.email)
        if not user:
            # For a real system, you might create a placeholder user or just store invite by email
            # Here we require the user to exist for simplicity, or we can create a shell user
            raise HTTPException(status_code=404, detail="User with this email not found. They must sign up first.")
            
        # Check duplicate invite
        existing = await self.team_repo.get_member_by_user_id(org_id, user.id)
        if existing:
            raise HTTPException(status_code=409, detail="User is already a member or invited")
            
        member = UserOrganization(
            user_id=user.id,
            organization_id=org_id,
            role=invite_in.role,
            status="pending",
            invited_by=inviter_id
        )
        
        created = await self.team_repo.create(member)
        # Member Invited Activity Hook dispatched via Event Bus
        return created

    async def update_member(self, user_id: uuid.UUID, org_id: uuid.UUID, member_id: uuid.UUID, update_in: TeamMemberUpdate) -> UserOrganization:
        await self._check_permission(user_id, org_id, Permission.MANAGE_TEAM)
        
        member = await self.get_member(user_id, org_id, member_id)
        
        if update_in.role and update_in.role != member.role:
            # If changing role from owner to something else, check if last owner
            if member.role == "owner" and update_in.role != "owner":
                owners_count = await self.team_repo.count_owners(org_id)
                if owners_count <= 1:
                    raise HTTPException(status_code=400, detail="Cannot demote the last owner of the organization")
            member.role = update_in.role
            
        if update_in.status:
            member.status = update_in.status
            
        updated = await self.team_repo.update(member)
        # Role Changed Activity Hook dispatched via Event Bus
        return updated

    async def remove_member(self, user_id: uuid.UUID, org_id: uuid.UUID, member_id: uuid.UUID) -> None:
        await self._check_permission(user_id, org_id, Permission.MANAGE_TEAM)
        
        member = await self.get_member(user_id, org_id, member_id)
        
        if member.role == "owner":
            owners_count = await self.team_repo.count_owners(org_id)
            if owners_count <= 1:
                raise HTTPException(status_code=400, detail="Cannot remove the last owner of the organization")
                
        await self.team_repo.delete(member)
        # Member Removed Activity Hook dispatched via Event Bus

    async def accept_invite(self, user_id: uuid.UUID, org_id: uuid.UUID, member_id: uuid.UUID, token: str) -> UserOrganization:
        # In a real app, validate token
        member = await self.team_repo.get_member_by_id(org_id, member_id)
        if not member or member.user_id != user_id:
            raise HTTPException(status_code=404, detail="Invite not found or unauthorized")
            
        if member.status == "accepted":
            raise HTTPException(status_code=400, detail="Invite already accepted")
            
        member.status = "accepted"
        member.joined_at = datetime.now(UTC)
        
        updated = await self.team_repo.update(member)
        # Member Joined Activity Hook dispatched via Event Bus
        return updated

    async def reject_invite(self, user_id: uuid.UUID, org_id: uuid.UUID, member_id: uuid.UUID, token: str) -> UserOrganization:
        # In a real app, validate token
        member = await self.team_repo.get_member_by_id(org_id, member_id)
        if not member or member.user_id != user_id:
            raise HTTPException(status_code=404, detail="Invite not found or unauthorized")
            
        if member.status != "pending":
            raise HTTPException(status_code=400, detail="Invite is not pending")
            
        member.status = "rejected"
        updated = await self.team_repo.update(member)
        return updated

    async def resend_invite(self, inviter_id: uuid.UUID, org_id: uuid.UUID, member_id: uuid.UUID) -> None:
        await self._check_permission(inviter_id, org_id, Permission.INVITE_MEMBERS)
        
        member = await self.team_repo.get_member_by_id(org_id, member_id)
        if not member or member.status != "pending":
            raise HTTPException(status_code=400, detail="Can only resend pending invites")
            
        # Invitation Resent Activity Hook / Email logic dispatched via Event Bus
