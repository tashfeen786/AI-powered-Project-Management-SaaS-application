from sqlalchemy import String, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
from typing import List
import uuid

class Sprint(BaseModel):
    __tablename__ = "sprints"

    name: Mapped[str] = mapped_column(String(255))
    goal: Mapped[str | None] = mapped_column(String(1000))
    status: Mapped[str] = mapped_column(String(50), default="Planned")
    start_date: Mapped[str | None] = mapped_column(Date)
    end_date: Mapped[str | None] = mapped_column(Date)
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    
    tasks: Mapped[List["Task"]] = relationship(back_populates="sprint")
