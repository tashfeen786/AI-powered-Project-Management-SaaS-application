class TaskGenerationPromptService:
    @staticmethod
    def build_task_generation_prompt(plan_content: str) -> str:
        """
        Builds a prompt that forces the LLM to output a strict JSON array of Kanban tasks
        based on the Sprint Plan.
        """
        prompt = f"""
You are an expert Technical Project Manager and Scrum Master.
Your task is to convert the following Sprint Plan into a structured list of actionable Kanban tasks.

Sprint Plan:
---
{plan_content}
---

You MUST output ONLY valid JSON. Do not include markdown code blocks, do not include conversation, just the raw JSON object.
Your JSON must strictly match this schema:

{{
  "sprints": [
    {{
      "name": "Sprint 1",
      "tasks": [
        {{
          "title": "Task title",
          "description": "Detailed description of what needs to be done",
          "priority": "High", // Must be exactly one of: Low, Medium, High, Critical
          "status": "To Do", // Must be exactly: To Do
          "story_points": 5, // Integer
          "estimated_hours": 8.0, // Float
          "labels": ["Frontend", "Auth"], // Array of short strings
          "acceptance_criteria": "- Criterion 1\\n- Criterion 2", // String
          "dependencies": [] // Array of strings (task titles this depends on)
        }}
      ]
    }}
  ]
}}

Generate comprehensive tasks that cover all requirements in the plan. Ensure story points and hours are realistically distributed.
Output ONLY JSON.
"""
        return prompt.strip()
