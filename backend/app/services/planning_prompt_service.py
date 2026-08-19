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
Your task is to transform the provided approved requirements into a structured 5-phase project plan in JSON format.

{additional_instructions}

You MUST base the execution plan STRICTLY on the following approved requirements.
Do NOT hallucinate or invent features not mentioned in the requirements.

Approved Requirements:
---
{srs_content}
---

You MUST generate EXACTLY 5 phases. The default structure is:
1. Analysis & Architecture
2. UI/UX & Design
3. Backend Development
4. Frontend Development & Integration
5. Testing, Deployment & Documentation
(You may adjust the names to fit the project, but you must output exactly 5 phases).

You must return ONLY a raw JSON object matching the following schema exactly:

{{
  "phases": [
    {{
      "name": "Phase 1: Analysis & Architecture",
      "description": "Detailed description of the phase.",
      "objective": "Clear objective to achieve in this phase.",
      "estimated_hours": 120,
      "story_points": 40,
      "dependencies": ["List of external dependencies or previous phases"],
      "requirement_ids": ["uuid-1", "uuid-2"]
    }}
  ]
}}

Ensure that `estimated_hours` and `story_points` are numbers (not strings).
Ensure that `requirement_ids` use the EXACT UUID strings provided in the input. 
Return ONLY the JSON object. Do not include conversational filler or markdown formatting outside of the JSON block.
"""
        return prompt.strip()
