from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid

class Reaction(BaseModel):
    __tablename__ = "reactions"

    emoji: Mapped[str] = mapped_column(String(10))
    comment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("comments.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    comment: Mapped["Comment"] = relationship()
    user: Mapped["User"] = relationship()
