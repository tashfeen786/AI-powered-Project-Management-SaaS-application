from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.message_repository import MessageRepository
import uuid

class MemoryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.msg_repo = MessageRepository(db)

    async def get_conversation_history(self, conversation_id: uuid.UUID) -> list:
        """
        Retrieves formatted conversation history for Groq messages array.
        Trims logic could be applied here for token limits.
        """
        messages = await self.msg_repo.get_by_conversation(conversation_id, limit=20) # Keep last 20 for memory
        
        history = []
        for msg in messages:
            history.append({
                "role": msg.role,
                "content": msg.content
            })
            
        return history
