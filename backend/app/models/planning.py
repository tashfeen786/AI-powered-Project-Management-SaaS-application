from sqlalchemy import String, Text, ForeignKey, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid

class Planning(BaseModel):
    __tablename__ = "sprint_plans"

    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(50), default="Draft") # Draft, Review, Approved, Archived
    
    planning_content: Mapped[str] = mapped_column(Text)
    
    estimated_duration: Mapped[str | None] = mapped_column(String(100)) # e.g. "12 weeks"
    estimated_story_points: Mapped[int | None] = mapped_column(Integer, default=0)
    estimated_hours: Mapped[float | None] = mapped_column(Float, default=0.0)
    
    requirement_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("requirements.id"))
    requirement: Mapped["Requirement"] = relationship()
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship()
    
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    
    generated_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    generated_by: Mapped["User"] = relationship(foreign_keys=[generated_by_id])
    
    updated_by_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", use_alter=True))
