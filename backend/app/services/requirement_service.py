from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.requirement import GenerateRequirementRequest, RequirementUpdate, RequirementCreate
from app.repositories.requirement_repository import RequirementRepository
from app.repositories.project_repository import ProjectRepository
from app.services.retrieval_service import RetrievalService
from app.services.requirement_prompt_service import RequirementPromptService
from app.services.groq_service import GroqService
from app.models.requirement import Requirement
from typing import Sequence, Tuple
from datetime import datetime, UTC
import uuid
import structlog
from app.services.activity_service import ActivityService

logger = structlog.get_logger()

class RequirementService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.req_repo = RequirementRepository(db)
        self.project_repo = ProjectRepository(db)
        self.retrieval_service = RetrievalService(db)
        
    async def generate_srs(self, user_id: uuid.UUID, org_id: uuid.UUID, project_id: uuid.UUID, request: GenerateRequirementRequest) -> Requirement:
        """
        Orchestrates RAG to generate an SRS document.
        """
        logger.info("Generation Started", project_id=str(project_id), title=request.title)
        
        # 1. Validate Project
        project = await self.project_repo.get_by_id(project_id, org_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # 2. Retrieve Context (Use a broad query to get general project context, or synthesize one)
        # Using a generalized query string to fetch the most structurally relevant chunks
        search_query = "project overview, scope, business objectives, features, functional requirements, user stories"
        context = await self.retrieval_service.retrieve_context(
            query=search_query,
            project_id=project_id,
            org_id=org_id,
            limit=15  # Fetch more chunks for comprehensive SRS
        )
        
        if not context:
            logger.warning("No context found for SRS generation", project_id=str(project_id))
            # We can still proceed, the AI will just say "No information provided" per prompt instructions
            
        logger.info("Retrieved Chunks", count=len(context))

        # 3. Build Prompt
        prompt = RequirementPromptService.build_srs_prompt(
            context_chunks=context,
            title=request.title,
            additional_context=request.additional_context
        )
        system_prompt = "You are an expert Technical Business Analyst."

        # 4. Call Groq
        try:
            # Using centralized settings.GROQ_MODEL for high reasoning capabilities required for SRS
            result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt)
        except Exception as e:
            logger.error("Generation Failed", error=str(e))
            raise HTTPException(status_code=500, detail="AI generation failed")

        logger.info("Generation Completed", tokens_used=result["tokens"])

        # 5. Calculate Confidence Score (Heuristic based on retrieved chunks)
        # In a real setup, we might evaluate distance scores. Here, we'll assign a base confidence based on context volume.
        confidence = min(0.95, 0.4 + (len(context) * 0.04))
        if not context:
            confidence = 0.1

        # 6. Versioning & Persistence
        latest_version = await self.req_repo.get_latest_version(org_id, project_id)
        new_version = latest_version + 1
        
        sources = [
            {"document_id": str(c["document_id"]), "metadata": c["metadata"]}
            for c in context
        ]

        req = Requirement(
            title=request.title,
            version=new_version,
            status="Draft",
            confidence_score=confidence,
            generated_content=result["text"],
            source_documents=sources,
            project_id=project_id,
            organization_id=org_id,
            created_by_id=user_id
        )
        
        created = await self.req_repo.create(req)
        
        act_service = ActivityService(self.db)
        await act_service.log_activity(
            project_id=project_id,
            actor_id=user_id,
            type="requirement_generated",
            description=f"AI Generated SRS: '{request.title}'",
            org_id=org_id
        )
        
        return created

    async def get_requirements(
        self, 
        org_id: uuid.UUID, 
        project_id: uuid.UUID, 
        page: int = 1, 
        limit: int = 10,
        status: str | None = None,
        priority: str | None = None,
        search: str | None = None,
        sort_by: str = "created_at",
        sort_desc: bool = True
    ) -> Tuple[Sequence[Requirement], int]:
        return await self.req_repo.get_by_project_paginated(
            org_id, project_id, page, limit, status, priority, search, sort_by, sort_desc
        )

    async def create_requirement(self, user_id: uuid.UUID, org_id: uuid.UUID, create_in: RequirementCreate) -> Requirement:
        req = Requirement(
            title=create_in.title,
            description=create_in.description,
            category=create_in.category,
            priority=create_in.priority,
            status=create_in.status,
            acceptance_criteria=create_in.acceptance_criteria,
            generated_content=create_in.generated_content,
            project_id=create_in.project_id,
            organization_id=org_id,
            created_by_id=user_id,
            version=1
        )
        created = await self.req_repo.create(req)
        
        # Record initial version
        from app.models.requirement_history import RequirementHistory
        history = RequirementHistory(
            requirement_id=created.id,
            version=1,
            change_summary="Initial creation",
            snapshot={
                "title": req.title,
                "description": req.description,
                "category": req.category,
                "priority": req.priority,
                "status": req.status,
                "acceptance_criteria": req.acceptance_criteria
            },
            changed_by_id=user_id
        )
        self.db.add(history)
        await self.db.commit()
        
        act_service = ActivityService(self.db)
        await act_service.log_activity(
            project_id=create_in.project_id,
            actor_id=user_id,
            type="requirement_created",
            description=f"Created requirement '{create_in.title}'",
            org_id=org_id
        )
        
        return created

    async def get_requirement(self, org_id: uuid.UUID, req_id: uuid.UUID) -> Requirement:
        req = await self.req_repo.get_by_id(req_id, org_id)
        if not req:
            raise HTTPException(status_code=404, detail="Requirement document not found")
        return req

    async def update_requirement(self, user_id: uuid.UUID, org_id: uuid.UUID, req_id: uuid.UUID, update_in: RequirementUpdate) -> Requirement:
        req = await self.get_requirement(org_id, req_id)
        
        changes = []
        is_significant_change = False
        
        if update_in.title is not None and req.title != update_in.title:
            changes.append(f"Title changed")
            req.title = update_in.title
            is_significant_change = True
            
        if update_in.status is not None and req.status != update_in.status:
            changes.append(f"Status changed to {update_in.status}")
            req.status = update_in.status
            
        if update_in.description is not None and req.description != update_in.description:
            changes.append(f"Description changed")
            req.description = update_in.description
            is_significant_change = True
            
        if update_in.category is not None and req.category != update_in.category:
            changes.append(f"Category changed to {update_in.category}")
            req.category = update_in.category
            is_significant_change = True
            
        if update_in.priority is not None and req.priority != update_in.priority:
            changes.append(f"Priority changed to {update_in.priority}")
            req.priority = update_in.priority
            is_significant_change = True
            
        if update_in.acceptance_criteria is not None and req.acceptance_criteria != update_in.acceptance_criteria:
            changes.append(f"Acceptance criteria updated")
            req.acceptance_criteria = update_in.acceptance_criteria
            is_significant_change = True
            
        if update_in.generated_content is not None:
            req.generated_content = update_in.generated_content
            
        if is_significant_change and req.status == "Approved":
            req.status = "Review"
            changes.append("Status changed to Review (was Approved)")
            
        req.updated_by_id = user_id
        
        if is_significant_change:
            req.version += 1
            
        updated_req = await self.req_repo.update(req)
        
        if changes:
            from app.models.requirement_history import RequirementHistory
            history = RequirementHistory(
                requirement_id=req.id,
                version=req.version,
                change_summary=", ".join(changes),
                snapshot={
                    "title": req.title,
                    "description": req.description,
                    "category": req.category,
                    "priority": req.priority,
                    "status": req.status,
                    "acceptance_criteria": req.acceptance_criteria
                },
                changed_by_id=user_id
            )
            self.db.add(history)
            await self.db.commit()
            
        return updated_req

    async def approve_requirement(self, user_id: uuid.UUID, org_id: uuid.UUID, req_id: uuid.UUID) -> Requirement:
        req = await self.get_requirement(org_id, req_id)
        
        if req.status == "Approved":
            return req
            
        req.status = "Approved"
        req.updated_by_id = user_id
        
        updated_req = await self.req_repo.update(req)
        
        from app.models.requirement_history import RequirementHistory
        history = RequirementHistory(
            requirement_id=req.id,
            version=req.version,
            change_summary="Requirement Approved",
            snapshot={
                "title": req.title,
                "description": req.description,
                "category": req.category,
                "priority": req.priority,
                "status": req.status,
                "acceptance_criteria": req.acceptance_criteria
            },
            changed_by_id=user_id
        )
        self.db.add(history)
        await self.db.commit()
        
        act_service = ActivityService(self.db)
        await act_service.log_activity(
            project_id=req.project_id,
            actor_id=user_id,
            type="requirement_approved",
            description=f"Requirement '{req.title}' was approved",
            org_id=org_id
        )
        
        return updated_req

    async def delete_requirement(self, org_id: uuid.UUID, req_id: uuid.UUID) -> None:
        req = await self.get_requirement(org_id, req_id)
        await self.req_repo.delete(req)

    async def get_requirement_history(self, org_id: uuid.UUID, req_id: uuid.UUID):
        from sqlalchemy import select, desc
        from sqlalchemy.orm import selectinload
        from app.models.requirement_history import RequirementHistory
        
        await self.get_requirement(org_id, req_id)
        
        result = await self.db.execute(
            select(RequirementHistory)
            .options(selectinload(RequirementHistory.changed_by))
            .where(RequirementHistory.requirement_id == req_id)
            .order_by(desc(RequirementHistory.created_at))
        )
        return result.scalars().all()

    async def analyze_requirements(self, user_id: uuid.UUID, org_id: uuid.UUID, project_id: uuid.UUID) -> dict:
        logger.info("Analysis Started", project_id=str(project_id))
        
        # 1. Fetch requirements
        reqs, _ = await self.get_requirements(org_id, project_id, page=1, limit=500)
        
        empty_response = {
            "duplicates": [],
            "missing_requirements": [],
            "ambiguous_requirements": [],
            "conflicts": [],
            "dependencies": [],
            "risks": [],
            "missing_acceptance_criteria": [],
            "priority_suggestions": []
        }
        
        if not reqs:
            return empty_response
            
        # 2. Build prompt
        prompt = RequirementPromptService.build_analysis_prompt(reqs)
        system_prompt = "You are an AI that exclusively outputs valid JSON. No markdown, no conversation."
        
        # 3. Call Groq
        try:
            result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt)
        except Exception as e:
            logger.error("Analysis Failed", error=str(e))
            raise HTTPException(status_code=500, detail="AI generation failed")
            
        # 4. Parse JSON
        from app.utils.json_utils import extract_json
        try:
            parsed_json = extract_json(result["text"])
            return parsed_json
        except ValueError as e:
            logger.error("Analysis JSON parsing failed", error=str(e), text=result["text"])
            raise HTTPException(status_code=500, detail="Failed to parse AI analysis response")
