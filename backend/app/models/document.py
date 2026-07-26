from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid

class Document(BaseModel):
    __tablename__ = "documents"

    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[str | None] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(50)) # srs, requirements, plan
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship(back_populates="documents")
    
    author_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    author: Mapped["User"] = relationship()
