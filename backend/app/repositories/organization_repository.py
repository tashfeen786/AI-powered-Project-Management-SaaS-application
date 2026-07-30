from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.organization import Organization
from app.models.user_organization import UserOrganization
from app.models.user import User
import uuid
from typing import Sequence

class OrganizationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, org_id: str | uuid.UUID) -> Organization | None:
        result = await self.db.execute(select(Organization).where(Organization.id == org_id, Organization.is_deleted == False))
        return result.scalar_one_or_none()
        
    async def get_by_domain(self, domain: str) -> Organization | None:
        result = await self.db.execute(select(Organization).where(Organization.domain == domain, Organization.is_deleted == False))
        return result.scalar_one_or_none()
        
    async def get_user_organizations(self, user_id: str | uuid.UUID) -> Sequence[Organization]:
        # Join UserOrganization with Organization
        stmt = (
            select(Organization)
            .join(UserOrganization, Organization.id == UserOrganization.organization_id)
            .where(UserOrganization.user_id == user_id, Organization.is_deleted == False)
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()
        
    async def create(self, organization: Organization) -> Organization:
        self.db.add(organization)
        await self.db.commit()
        await self.db.refresh(organization)
        return organization
        
    async def update(self, organization: Organization) -> Organization:
        await self.db.commit()
        await self.db.refresh(organization)
        return organization

    async def add_user_to_org(self, user_id: uuid.UUID, org_id: uuid.UUID, role: str = "member") -> UserOrganization:
        user_org = UserOrganization(user_id=user_id, organization_id=org_id, role=role)
        self.db.add(user_org)
        await self.db.commit()
        return user_org
        
    async def get_user_role(self, user_id: uuid.UUID, org_id: uuid.UUID) -> UserOrganization | None:
        stmt = select(UserOrganization).where(
            UserOrganization.user_id == user_id, 
            UserOrganization.organization_id == org_id
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
