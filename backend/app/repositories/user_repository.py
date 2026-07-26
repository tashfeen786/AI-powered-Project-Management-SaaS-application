from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
import uuid

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email, User.is_deleted == False))
        return result.scalar_one_or_none()
        
    async def get_by_id(self, user_id: str | uuid.UUID) -> User | None:
        result = await self.db.execute(select(User).where(User.id == user_id, User.is_deleted == False))
        return result.scalar_one_or_none()
        
    async def create(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
        
    async def update(self, user: User) -> User:
        await self.db.commit()
        await self.db.refresh(user)
        return user
