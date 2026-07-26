from sqlalchemy import String, Text, ForeignKey, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import BaseModel
import uuid

class Requirement(BaseModel):
    __tablename__ = "requirements"

    title: Mapped[str] = mapped_column(String(255))
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(50), default="Draft") # Draft, Review, Approved, Archived
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    
    generated_content: Mapped[str] = mapped_column(Text)
    source_documents: Mapped[list | None] = mapped_column(JSONB, default=list) # Store which chunks/docs were used
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship()
    
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    
    generated_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    generated_by: Mapped["User"] = relationship(foreign_keys=[generated_by_id])
    
    updated_by_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", use_alter=True))
