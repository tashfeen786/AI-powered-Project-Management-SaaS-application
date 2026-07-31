from sqlalchemy import ForeignKey, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid

class Mention(BaseModel):
    __tablename__ = "mentions"

    comment_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("comments.id", ondelete="CASCADE"), nullable=True, index=True)
    task_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), nullable=True, index=True)
    
    mentioned_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    mentioned_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    
    notification_sent: Mapped[bool] = mapped_column(Boolean, default=False)

    mentioned_user: Mapped["User"] = relationship(foreign_keys=[mentioned_user_id])
    mentioned_by: Mapped["User"] = relationship(foreign_keys=[mentioned_by_id])
