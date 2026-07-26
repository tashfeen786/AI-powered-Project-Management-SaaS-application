from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc
from app.models.message import Message
import uuid
from typing import Sequence

class MessageRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_conversation(self, conversation_id: uuid.UUID, limit: int = 50) -> Sequence[Message]:
        query = select(Message).where(
            Message.conversation_id == conversation_id,
            Message.is_deleted == False
        ).order_by(asc(Message.created_at)).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, message: Message) -> Message:
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message
