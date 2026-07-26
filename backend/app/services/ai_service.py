from sqlalchemy.ext.asyncio import AsyncSession
from app.services.retrieval_service import RetrievalService
from app.services.prompt_service import PromptService
from app.services.groq_service import GroqService
from app.schemas.ai import AIQueryRequest, AIResponse
import uuid
import structlog

logger = structlog.get_logger()

class AIService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.retrieval_service = RetrievalService(db)
        
    async def generate_response(self, user_id: uuid.UUID, org_id: uuid.UUID, request: AIQueryRequest) -> AIResponse:
        """
        Orchestrates the entire RAG pipeline:
        Retrieve Context -> Build Prompt -> Call Groq
        """
        logger.info("Starting AI generation", query=request.query, project_id=str(request.project_id))
        
        # 1. Retrieve Context from pgvector
        context = await self.retrieval_service.retrieve_context(
            query=request.query,
            project_id=request.project_id,
            org_id=org_id,
            limit=request.context_limit
        )
        
        # 2. Build Prompt
        prompt = PromptService.build_rag_prompt(request.query, context)
        system_prompt = "You are an intelligent Project Management AI Copilot."
        
        # 3. Call Groq
        # You can make the model configurable or dynamically choose based on complexity.
        model_name = "llama3-70b-8192" 
        result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt, model=model_name)
        
        # 4. Format Sources
        sources = [
            {"document_id": c["document_id"], "metadata": c["metadata"]}
            for c in context
        ]
        
        return AIResponse(
            response=result["text"],
            sources=sources,
            model=result["model"],
            tokens_used=result["tokens"]
        )
