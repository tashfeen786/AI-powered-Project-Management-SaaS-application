from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.services.context_service import ContextService
from app.services.memory_service import MemoryService
from app.services.retrieval_service import RetrievalService
from app.services.groq_service import GroqService
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.copilot import CreateConversationRequest, ChatRequest, SourceItem
import uuid
import structlog
from typing import Sequence

logger = structlog.get_logger()

class CopilotService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.conv_repo = ConversationRepository(db)
        self.msg_repo = MessageRepository(db)
        self.context_service = ContextService(db)
        self.memory_service = MemoryService(db)
        self.retrieval_service = RetrievalService(db)
        
    async def create_conversation(self, user_id: uuid.UUID, org_id: uuid.UUID, request: CreateConversationRequest) -> Conversation:
        conv = Conversation(
            project_id=request.project_id,
            organization_id=org_id,
            created_by_id=user_id,
            title=request.title
        )
        return await self.conv_repo.create(conv)

    async def get_conversations(self, user_id: uuid.UUID, org_id: uuid.UUID) -> Sequence[Conversation]:
        return await self.conv_repo.get_by_user(user_id, org_id)

    async def get_conversation(self, conv_id: uuid.UUID, org_id: uuid.UUID, user_id: uuid.UUID) -> Conversation:
        conv = await self.conv_repo.get_by_id(conv_id, org_id, user_id)
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        # Load messages explicitly if needed or rely on lazy loading
        return conv

    async def delete_conversation(self, conv_id: uuid.UUID, org_id: uuid.UUID, user_id: uuid.UUID):
        conv = await self.get_conversation(conv_id, org_id, user_id)
        await self.conv_repo.delete(conv)

    async def send_message(self, user_id: uuid.UUID, org_id: uuid.UUID, request: ChatRequest) -> Message:
        logger.info("Copilot Chat Started", conversation_id=str(request.conversation_id))
        
        # 1. Load Conversation
        conv = await self.get_conversation(request.conversation_id, org_id, user_id)
        
        # 2. Save User Message
        user_msg = Message(
            conversation_id=conv.id,
            role="user",
            content=request.content
        )
        await self.msg_repo.create(user_msg)
        
        # 3. Build Memory
        history = await self.memory_service.get_conversation_history(conv.id)
        
        # 4. Gather RAG Vector Context (if project is scoped)
        vector_context = []
        if conv.project_id:
            vector_context = await self.retrieval_service.retrieve_context(
                query=request.content, 
                project_id=conv.project_id, 
                org_id=org_id, 
                limit=3
            )
            
        # 5. Gather Global Metadata Context
        meta_context = {}
        if conv.project_id:
            meta_context = await self.context_service.gather_project_context(conv.project_id, org_id)
            
        # 6. Build Prompt
        system_prompt = f"""
You are the primary AI Copilot for this Project Management Platform.
You must answer the user's question using ONLY the provided project context, retrieved documents, and conversational memory.
If the information is unavailable, explicitly state: "I couldn't find this information inside your project."
Do not hallucinate external knowledge outside the scope of software project management.

--- Project Metadata State ---
{meta_context}
------------------------------

--- Retrieved Documents Context ---
{chr(10).join([c['text'] for c in vector_context])}
-----------------------------------
"""
        
        # We construct the messages array for Groq
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(history)
        # Note: GroqService.generate only takes prompt/system_prompt in the current implementation.
        # We need a custom call or we can format the history into the prompt text directly.
        # Let's format history into prompt string for now to reuse GroqService.
        
        history_text = "\n".join([f"{m['role'].capitalize()}: {m['content']}" for m in history])
        final_prompt = f"Chat History:\n{history_text}\n\nUser: {request.content}\nAssistant:"
        
        # 7. Call Groq
        # Future Hook: TODO: Streaming Responses
        # Future Hook: TODO: Tool Calling
        # Future Hook: TODO: Code Interpreter
        result = await GroqService.generate(prompt=final_prompt, system_prompt=system_prompt, model="llama3-70b-8192")
        
        # 8. Build Sources list
        sources = []
        if conv.project_id:
            sources.append({"type": "Project", "title": meta_context.get("project_name", "Project Data")})
        for c in vector_context:
            sources.append({"type": "Document Chunk", "title": c.get("metadata", {}).get("filename", "Document")})
            
        # 9. Save Assistant Response
        ai_msg = Message(
            conversation_id=conv.id,
            role="assistant",
            content=result["text"],
            sources=sources
        )
        saved_msg = await self.msg_repo.create(ai_msg)
        
        # Auto-generate Title if this is the first real exchange
        if len(history) <= 2 and conv.title == "New Conversation":
            # Very brief generation
            title_prompt = f"Summarize this query into a short 3-4 word title: {request.content}"
            t_res = await GroqService.generate(prompt=title_prompt, system_prompt="Output only the title.", model="llama3-8b-8192")
            conv.title = t_res["text"].replace('"', '').strip()
            await self.conv_repo.update(conv)
            
        return saved_msg
