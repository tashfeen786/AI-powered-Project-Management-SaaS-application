from sqlalchemy import String, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid

class Milestone(BaseModel):
    __tablename__ = "milestones"

    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(String(1000))
    status: Mapped[str] = mapped_column(String(50), default="Pending")
    due_date: Mapped[str | None] = mapped_column(Date)
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
