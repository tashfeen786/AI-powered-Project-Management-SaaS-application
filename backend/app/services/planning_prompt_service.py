class PlanningPromptService:
    @staticmethod
    def build_sprint_plan_prompt(srs_content: str, additional_context: str = None) -> str:
        """
        Builds a strict prompt for generating a complete Agile execution plan (Sprint Plan)
        from a Software Requirements Specification (SRS).
        """
        additional_instructions = ""
        if additional_context:
            additional_instructions = f"Additional Constraints/Instructions:\n{additional_context}\n"
            
        prompt = f"""
You are an expert Agile Scrum Master and Technical Project Manager.
Your task is to transform the provided Software Requirements Specification (SRS) into a realistic, structured Agile execution plan in Markdown format.

{additional_instructions}

You MUST base the execution plan STRICTLY on the following SRS.
If the SRS is insufficient to derive certain milestones, explicitly state that in your response.
Do NOT hallucinate or invent features not mentioned in the SRS.

SRS Document:
---
{srs_content}
---

You must include the following sections exactly formatted as Markdown headers (H2):
## 1. Project Summary
## 2. Milestones (e.g. Project Setup, Core Development, Testing, Deployment)
## 3. Recommended Team Roles
## 4. Dependencies & Risks
## 5. Sprint 1
### Sprint Goal
### Tasks
- [Task Title] | [Priority] | [Story Points] | [Estimated Hours] | [Suggested Role]
  - Description: ...
  - Acceptance Criteria: ...
## 6. Sprint 2
... (Continue for as many Sprints as reasonably needed to fulfill the SRS)

At the very top of your response, you MUST provide these exactly formatted lines before the markdown content:
ESTIMATED_DURATION: [e.g. 8 weeks]
ESTIMATED_STORY_POINTS: [e.g. 120]
ESTIMATED_HOURS: [e.g. 450.5]

Format the output cleanly.
Return ONLY the metadata lines and the Markdown content. Do not include conversational filler.
"""
        return prompt.strip()
