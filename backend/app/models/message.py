from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import BaseModel
import uuid

class Message(BaseModel):
    __tablename__ = "messages"

    role: Mapped[str] = mapped_column(String(50)) # system, user, assistant
    content: Mapped[str] = mapped_column(Text)
    
    sources: Mapped[list | None] = mapped_column(JSONB, default=list)
    metadata_: Mapped[dict | None] = mapped_column(JSONB, default=dict)
    
    conversation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("conversations.id", ondelete="CASCADE"))
    conversation: Mapped["Conversation"] = relationship(back_populates="messages")
