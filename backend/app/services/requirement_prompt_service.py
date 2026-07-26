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
