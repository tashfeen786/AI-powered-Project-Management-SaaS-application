from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid
from sqlalchemy.dialects.postgresql import JSONB

class Activity(BaseModel):
    __tablename__ = "activity_logs"

    type: Mapped[str] = mapped_column(String(50)) # user_action, ai_generation, system_event
    description: Mapped[str] = mapped_column(Text)
    metadata_data: Mapped[dict | None] = mapped_column(JSONB)
    
    project_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship(back_populates="activities")
    
    task_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("tasks.id"))
    task: Mapped["Task"] = relationship(back_populates="activities")
    
    actor_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    actor: Mapped["User"] = relationship()
