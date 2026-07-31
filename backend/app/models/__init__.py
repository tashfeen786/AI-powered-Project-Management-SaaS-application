from .organization import Organization
from .user import User
from .user_organization import UserOrganization
from .project import Project
from .task import Task
from .document import Document
from .activity import Activity
from .embedding import DocumentEmbedding
from .requirement import Requirement
from .milestone import Milestone
from .sprint import Sprint
from .planning import Planning
from .task_generation import TaskGeneration
from .ai_insight import AIInsight
from .conversation import Conversation
from .message import Message
from .background_job import BackgroundJob
from .notification import Notification
from .settings import Setting
from .comment import Comment
from .attachment import Attachment
from .mention import Mention
from .reaction import Reaction
from .task_watcher import TaskWatcher

# For Alembic to discover all models easily
__all__ = [
    "Organization",
    "User",
    "UserOrganization",
    "Project",
    "Task",
    "Document",
    "Activity",
    "DocumentEmbedding",
    "Requirement",
    "Milestone",
    "Sprint",
    "Planning",
    "TaskGeneration",
    "AIInsight",
    "Conversation",
    "Message",
    "BackgroundJob",
    "Notification",
    "Setting",
    "Comment",
    "Attachment",
    "Mention",
    "Reaction",
    "TaskWatcher"
]
