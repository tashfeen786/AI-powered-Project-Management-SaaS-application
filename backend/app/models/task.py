from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid

class Task(BaseModel):
    __tablename__ = "tasks"

    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="todo") # todo, in_progress, in_review, done
    priority: Mapped[str] = mapped_column(String(50), default="medium")
    story_points: Mapped[int | None] = mapped_column(default=0)
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship(back_populates="tasks")
    
    assignee_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    assignee: Mapped["User"] = relationship()
