from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.organization import OrganizationCreate, OrganizationUpdate
from app.repositories.organization_repository import OrganizationRepository
from app.repositories.user_repository import UserRepository
from app.models.organization import Organization
from typing import Sequence
import uuid

class OrganizationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.org_repo = OrganizationRepository(db)
        self.user_repo = UserRepository(db)
        
    async def get_my_organizations(self, user_id: uuid.UUID) -> Sequence[Organization]:
        return await self.org_repo.get_user_organizations(user_id)
        
    async def get_current_organization(self, user_id: uuid.UUID) -> Organization:
        user = await self.user_repo.get_by_id(user_id)
        if not user or not user.current_organization_id:
            raise HTTPException(status_code=404, detail="No active organization found")
            
        org = await self.org_repo.get_by_id(user.current_organization_id)
        if not org:
            raise HTTPException(status_code=404, detail="Organization not found")
            
        return org
        
    async def create_organization(self, user_id: uuid.UUID, org_in: OrganizationCreate) -> Organization:
        org = Organization(name=org_in.name, domain=org_in.domain)
        created_org = await self.org_repo.create(org)
        
        # Add user as owner
        await self.org_repo.add_user_to_org(user_id, created_org.id, role="owner")
        
        # Set as current organization
        user = await self.user_repo.get_by_id(user_id)
        user.current_organization_id = created_org.id
        await self.user_repo.update(user)
        
        return created_org
        
    async def update_organization(self, user_id: uuid.UUID, org_id: uuid.UUID, org_in: OrganizationUpdate) -> Organization:
        # Check permissions
        role = await self.org_repo.get_user_role(user_id, org_id)
        if not role or role.role not in ["admin", "owner"]:
            raise HTTPException(status_code=403, detail="Not enough permissions")
            
        org = await self.org_repo.get_by_id(org_id)
        if not org:
            raise HTTPException(status_code=404, detail="Organization not found")
            
        if org_in.name is not None:
            org.name = org_in.name
        if org_in.domain is not None:
            org.domain = org_in.domain
            
        return await self.org_repo.update(org)
        
    async def switch_organization(self, user_id: uuid.UUID, org_id: uuid.UUID) -> Organization:
        role = await self.org_repo.get_user_role(user_id, org_id)
        if not role:
            raise HTTPException(status_code=403, detail="User does not belong to this organization")
            
        user = await self.user_repo.get_by_id(user_id)
        user.current_organization_id = org_id
        await self.user_repo.update(user)
        
        org = await self.org_repo.get_by_id(org_id)
        return org
