from sqlalchemy import String, ForeignKey, Date, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
from typing import List
import uuid

class Sprint(BaseModel):
    __tablename__ = "sprints"

    name: Mapped[str] = mapped_column(String(255))
    goal: Mapped[str | None] = mapped_column(String(1000))
    status: Mapped[str] = mapped_column(String(50), default="Draft")
    start_date: Mapped[str | None] = mapped_column(Date)
    end_date: Mapped[str | None] = mapped_column(Date)
    
    # Wizard Fields
    duration: Mapped[int | None] = mapped_column(Integer) # in weeks
    capacity: Mapped[int | None] = mapped_column(Integer) # hours or points
    team_members: Mapped[list | None] = mapped_column(JSONB, default=list)
    velocity: Mapped[int | None] = mapped_column(Integer)
    story_points: Mapped[int | None] = mapped_column(Integer)
    
    # AI Suggestions
    ai_generated_plan: Mapped[str | None] = mapped_column(Text)
    timeline_suggestion: Mapped[str | None] = mapped_column(Text)
    risks_suggestion: Mapped[str | None] = mapped_column(Text)
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    
    tasks: Mapped[List["Task"]] = relationship(back_populates="sprint")
