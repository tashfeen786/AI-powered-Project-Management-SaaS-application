from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import joinedload
from app.models.user_organization import UserOrganization
from app.models.user import User
import uuid
from typing import Sequence

class TeamRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_team_members(self, org_id: uuid.UUID) -> Sequence[UserOrganization]:
        # Eager load the User object so we can map email and full_name to schema easily
        query = select(UserOrganization).options(joinedload(UserOrganization.user)).where(
            UserOrganization.organization_id == org_id,
            UserOrganization.is_deleted == False
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_member_by_id(self, org_id: uuid.UUID, member_id: uuid.UUID) -> UserOrganization | None:
        query = select(UserOrganization).options(joinedload(UserOrganization.user)).where(
            UserOrganization.id == member_id,
            UserOrganization.organization_id == org_id,
            UserOrganization.is_deleted == False
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_member_by_user_id(self, org_id: uuid.UUID, user_id: uuid.UUID) -> UserOrganization | None:
        query = select(UserOrganization).where(
            UserOrganization.user_id == user_id,
            UserOrganization.organization_id == org_id,
            UserOrganization.is_deleted == False
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def count_owners(self, org_id: uuid.UUID) -> int:
        query = select(func.count()).select_from(UserOrganization).where(
            UserOrganization.organization_id == org_id,
            UserOrganization.role == "owner",
            UserOrganization.status == "accepted",
            UserOrganization.is_deleted == False
        )
        result = await self.db.execute(query)
        return result.scalar_one()

    async def create(self, member: UserOrganization) -> UserOrganization:
        self.db.add(member)
        await self.db.commit()
        await self.db.refresh(member)
        return member

    async def update(self, member: UserOrganization) -> UserOrganization:
        await self.db.commit()
        await self.db.refresh(member)
        return member

    async def delete(self, member: UserOrganization) -> None:
        member.is_deleted = True
        await self.db.commit()
