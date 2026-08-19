from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import BaseModel
import uuid

class RequirementHistory(BaseModel):
    __tablename__ = "requirement_histories"

    requirement_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("requirements.id", ondelete="CASCADE"))
    version: Mapped[int] = mapped_column(Integer)
    
    change_summary: Mapped[str | None] = mapped_column(Text)
    snapshot: Mapped[dict] = mapped_column(JSONB)
    
    changed_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    changed_by: Mapped["User"] = relationship(foreign_keys=[changed_by_id])
