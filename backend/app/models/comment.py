from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid

class Comment(BaseModel):
    __tablename__ = "comments"

    content: Mapped[str] = mapped_column(Text)
    
    task_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"))
    task: Mapped["Task"] = relationship(back_populates="comments")
    
    author_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    author: Mapped["User"] = relationship()
