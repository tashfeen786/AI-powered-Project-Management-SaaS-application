import structlog
import uuid

logger = structlog.get_logger()

class NotificationService:
    """
    Placeholder service for triggering external communications.
    """
    @staticmethod
    async def notify_deadline(project_id: uuid.UUID, title: str, description: str):
        logger.info("Notification: Deadline Approaching", project_id=str(project_id), title=title)
        # TODO: Implement Email via SendGrid/SES
        # TODO: Implement Slack / MS Teams webhook integration
        
    @staticmethod
    async def notify_blocker(project_id: uuid.UUID, title: str, description: str):
        logger.info("Notification: Blocker Detected", project_id=str(project_id), title=title)
        # TODO: Push to WebSocket for real-time UI updates
        
    @staticmethod
    async def notify_overload(project_id: uuid.UUID, title: str, description: str):
        logger.info("Notification: Team Overloaded", project_id=str(project_id), title=title)
        
    @staticmethod
    async def notify_project_risk(project_id: uuid.UUID, title: str, description: str):
        logger.info("Notification: Critical Project Risk", project_id=str(project_id), title=title)
        # TODO: Dispatch email to PMs and Admins
