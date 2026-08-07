from sqlalchemy import String, Text, ForeignKey, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
from typing import List
import uuid

class Project(BaseModel):
    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(String(255), index=True)
    key: Mapped[str] = mapped_column(String(50), index=True) # e.g. PROJ-1
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="Planning") # Planning, Active, On Hold, Review, Completed, Archived
    priority: Mapped[str] = mapped_column(String(50), default="Medium") # Low, Medium, High, Critical
    progress: Mapped[int] = mapped_column(Integer, default=0)
    
    start_date: Mapped[str | None] = mapped_column(Date)
    end_date: Mapped[str | None] = mapped_column(Date)
    
    project_type: Mapped[str | None] = mapped_column(String(100))
    industry: Mapped[str | None] = mapped_column(String(100))
    target_platform: Mapped[str | None] = mapped_column(String(100))
    expected_users: Mapped[str | None] = mapped_column(String(100))
    budget: Mapped[str | None] = mapped_column(String(100))
    tech_preferences: Mapped[str | None] = mapped_column(Text)
    
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    organization: Mapped["Organization"] = relationship(back_populates="projects")
    
    created_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    created_by: Mapped["User"] = relationship(foreign_keys=[created_by_id])
    
    tasks: Mapped[List["Task"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    documents: Mapped[List["Document"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    activities: Mapped[List["Activity"]] = relationship(back_populates="project", cascade="all, delete-orphan")
