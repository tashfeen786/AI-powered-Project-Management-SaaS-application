from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.conversation import Conversation
import uuid
from typing import Sequence

class ConversationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user(self, user_id: uuid.UUID, org_id: uuid.UUID) -> Sequence[Conversation]:
        query = select(Conversation).where(
            Conversation.created_by_id == user_id, 
            Conversation.organization_id == org_id,
            Conversation.is_deleted == False
        ).order_by(desc(Conversation.created_at))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, conv_id: uuid.UUID, org_id: uuid.UUID, user_id: uuid.UUID) -> Conversation | None:
        result = await self.db.execute(select(Conversation).where(
            Conversation.id == conv_id, 
            Conversation.organization_id == org_id,
            Conversation.created_by_id == user_id,
            Conversation.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, conversation: Conversation) -> Conversation:
        self.db.add(conversation)
        await self.db.commit()
        await self.db.refresh(conversation)
        return conversation
        
    async def update(self, conversation: Conversation) -> Conversation:
        await self.db.commit()
        await self.db.refresh(conversation)
        return conversation
        
    async def delete(self, conversation: Conversation) -> None:
        conversation.is_deleted = True
        await self.db.commit()
