class RequirementPromptService:
    @staticmethod
    def build_srs_prompt(context_chunks: list, title: str, additional_context: str = None) -> str:
        """
        Builds a strict prompt for generating a complete Software Requirements Specification.
        """
        context_text = "\n\n---\n\n".join(
            [f"Document Fragment:\n{chunk['text']}" for chunk in context_chunks]
        )
        
        additional_instructions = ""
        if additional_context:
            additional_instructions = f"Additional User Instructions:\n{additional_context}\n"
        
        prompt = f"""
You are an expert Technical Business Analyst and AI Project Manager.
Your task is to generate a professional, highly structured Software Requirements Specification (SRS) in Markdown format.

Title of SRS: {title}
{additional_instructions}

You MUST base the SRS STRICTLY on the following provided project context.
If information for a specific section is missing from the context, you MUST state: "No information provided in source documents."
Do NOT hallucinate, fabricate, or invent requirements.

Context:
{context_text}

You must include the following sections exactly formatted as Markdown headers (H2):
## 1. Project Overview
## 2. Problem Statement
## 3. Business Objectives
## 4. Scope
## 5. Functional Requirements
## 6. Non-Functional Requirements
## 7. User Roles
## 8. User Stories
## 9. Acceptance Criteria
## 10. System Features
## 11. Constraints
## 12. Assumptions
## 13. Risks
## 14. Dependencies
## 15. Future Enhancements

Format the output cleanly with bullet points, bold text for emphasis, and clear readable structures.
Return ONLY the Markdown content. Do not include any conversational filler before or after the Markdown.
"""
        return prompt.strip()

    @staticmethod
    def build_analysis_prompt(requirements: list) -> str:
        req_text = "\n\n---\n\n".join(
            [f"ID: {r.id}\nTitle: {r.title}\nCategory: {r.category}\nPriority: {r.priority}\nStatus: {r.status}\nDescription: {r.description}\nAcceptance Criteria: {r.acceptance_criteria}" for r in requirements]
        )
        
        prompt = f"""
You are an expert Technical Project Manager and Business Analyst.
Your task is to analyze the following set of requirements for a project and identify potential issues or areas for improvement.

Requirements:
{req_text}

You must return ONLY a raw JSON object (no markdown formatting, no code blocks, no conversational text) matching the following schema exactly:

{{
  "duplicates": [
    {{
      "requirement_ids": ["uuid-1", "uuid-2"],
      "reason": "Explanation of why they are duplicates",
      "suggested_action": "Merge / Delete"
    }}
  ],
  "missing_requirements": [
    {{
      "title": "Suggested missing requirement title",
      "description": "Explanation of what is missing and why it's needed",
      "category": "Functional or Non-Functional"
    }}
  ],
  "ambiguous_requirements": [
    {{
      "requirement_id": "uuid",
      "reason": "Explanation of ambiguity",
      "suggested_action": "Reword / Add details"
    }}
  ],
  "conflicts": [
    {{
      "requirement_ids": ["uuid-1", "uuid-2"],
      "reason": "Explanation of the conflict",
      "suggested_action": "Modify one or both"
    }}
  ],
  "dependencies": [
    {{
      "requirement_id": "uuid-1",
      "depends_on_id": "uuid-2",
      "reason": "Explanation of dependency"
    }}
  ],
  "risks": [
    {{
      "requirement_id": "uuid",
      "risk_description": "Explanation of technical or business risk",
      "mitigation": "Suggested mitigation strategy"
    }}
  ],
  "missing_acceptance_criteria": [
    {{
      "requirement_id": "uuid",
      "suggested_criteria": "Suggested acceptance criteria text"
    }}
  ],
  "priority_suggestions": [
    {{
      "requirement_id": "uuid",
      "current_priority": "Low",
      "suggested_priority": "High",
      "reason": "Explanation for priority change"
    }}
  ]
}}

Ensure that requirement_id fields use the EXACT UUID strings provided in the input. Return ONLY the JSON object.
"""
        return prompt.strip()
