class TaskGenerationPromptService:
    @staticmethod
    def build_task_generation_prompt(reqs_content: str, plan_content: str) -> str:
        """
        Builds a prompt that forces the LLM to output a strict JSON array of Kanban tasks
        based on the Approved Requirements and Sprint Plan (5 Phases).
        """
        prompt = f"""
You are an expert Technical Project Manager and Scrum Master.
Your task is to convert the following Approved Requirements and 5-Phase Sprint Plan into a structured list of actionable Kanban tasks.

Approved Requirements:
---
{reqs_content}
---

5-Phase Sprint Plan:
---
{plan_content}
---

You MUST output ONLY valid JSON. Do not include markdown code blocks, do not include conversation, just the raw JSON object.
Your JSON must strictly match this schema:

{{
  "tasks": [
    {{
      "title": "Implement JWT Authentication",
      "description": "Detailed description of what needs to be done",
      "requirement_ids": ["uuid-of-requirement"],
      "phase": "Name of the phase exactly as it appears in the plan",
      "priority": "High", // Must be exactly one of: Low, Medium, High, Critical
      "story_points": 5, // Integer
      "estimated_hours": 8.0, // Float
      "acceptance_criteria": ["Criterion 1", "Criterion 2"],
      "dependencies": [] // Array of strings (task titles this depends on)
    }}
  ]
}}

RULES:
1. Every task MUST be linked to at least one real requirement UUID from the input. Do NOT use fake UUIDs. Do NOT use titles as IDs.
2. Every task MUST belong to one of the 5 phases from the plan. Use the EXACT phase name.
3. The number of tasks should be practical for the project scope (e.g. 10-30 tasks total).
4. Output ONLY JSON.
"""
        return prompt.strip()
