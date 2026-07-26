from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid

class Conversation(BaseModel):
    __tablename__ = "conversations"

    title: Mapped[str] = mapped_column(String(255), default="New Conversation")
    
    project_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship()
    
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    
    created_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    created_by: Mapped["User"] = relationship(foreign_keys=[created_by_id])
    
    messages: Mapped[list["Message"]] = relationship(back_populates="conversation", cascade="all, delete-orphan")
