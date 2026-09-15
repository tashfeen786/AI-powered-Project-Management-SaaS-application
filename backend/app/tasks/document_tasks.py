from app.core.celery_app import celery_app
import structlog
import uuid
import asyncio

logger = structlog.get_logger()

@celery_app.task(bind=True, max_retries=3)
def process_document_job(self, job_id: str, org_id: str, doc_id: str):
    """
    Celery task to handle heavy document parsing, chunking, and embedding.
    Because our services are async, we use an event loop wrapper.
    """
    logger.info("Celery Task Started: Document Processing", job_id=job_id, doc_id=doc_id)
    
    async def run_async():
        from app.db.session import async_sessionmaker, engine
        from sqlalchemy.ext.asyncio import AsyncSession
        from app.services.document_service import DocumentService
        
        async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with async_session() as db:
            doc_service = DocumentService(db)
            await doc_service.process_document(uuid.UUID(doc_id), uuid.UUID(org_id))
            await db.commit()
        
    try:
        asyncio.run(run_async())
        logger.info("Celery Task Completed: Document Processing", job_id=job_id)
        return {"status": "success", "doc_id": doc_id}
    except Exception as e:
        logger.error("Celery Task Failed", error=str(e))
        raise self.retry(exc=e, countdown=60)
