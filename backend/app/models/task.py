from sqlalchemy import String, Text, ForeignKey, Date, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import BaseModel
import uuid

class Task(BaseModel):
    __tablename__ = "tasks"

    title: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="Todo", index=True) # Backlog, Todo, In Progress, Review, Done
    priority: Mapped[str] = mapped_column(String(50), default="Medium") # Low, Medium, High, Critical
    
    story_points: Mapped[int | None] = mapped_column(Integer, default=0)
    estimated_hours: Mapped[float | None] = mapped_column(Float, default=0.0)
    actual_hours: Mapped[float | None] = mapped_column(Float, default=0.0)
    
    due_date: Mapped[str | None] = mapped_column(Date)
    order_index: Mapped[float] = mapped_column(Float, default=0.0, index=True) # Useful for Kanban drag & drop sorting
    labels: Mapped[list | None] = mapped_column(JSONB)
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship(back_populates="tasks")
    
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    
    assignee_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", use_alter=True))
    assignee: Mapped["User"] = relationship(foreign_keys=[assignee_id])
    
    reporter_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", use_alter=True))
    reporter: Mapped["User"] = relationship(foreign_keys=[reporter_id])
    
    sprint_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("sprints.id"))
    sprint: Mapped["Sprint"] = relationship(back_populates="tasks")
    
    comments: Mapped[list["Comment"]] = relationship(back_populates="task", cascade="all, delete-orphan")
    attachments: Mapped[list["Attachment"]] = relationship(back_populates="task", cascade="all, delete-orphan")
    activities: Mapped[list["Activity"]] = relationship(back_populates="task", cascade="all, delete-orphan")
