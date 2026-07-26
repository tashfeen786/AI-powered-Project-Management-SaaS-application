from app.core.celery_app import celery_app
import structlog

logger = structlog.get_logger()

@celery_app.task(bind=True, max_retries=5)
def send_email_notification_job(self, to_email: str, subject: str, template: str, context: dict):
    """
    External I/O job to dispatch emails via SendGrid/SES.
    """
    logger.info("Celery Task Started: Send Email", to_email=to_email)
    # TODO: Implement actual SMTP/API call
    return {"status": "success"}
