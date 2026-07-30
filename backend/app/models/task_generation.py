from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import BaseModel
import uuid

class TaskGeneration(BaseModel):
    __tablename__ = "task_generations"

    status: Mapped[str] = mapped_column(String(50), default="Pending") # Pending, Approved, Rejected
    
    # Store the raw JSON output from AI before it's approved and converted to actual tasks
    generated_tasks: Mapped[dict | None] = mapped_column(JSONB, default=dict)
    
    planning_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("sprint_plans.id"))
    planning: Mapped["Planning"] = relationship()
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship()
    
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    
    created_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    created_by: Mapped["User"] = relationship(foreign_keys=[created_by_id])
