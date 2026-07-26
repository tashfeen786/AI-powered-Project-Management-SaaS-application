class AIPromptService:
    @staticmethod
    def build_insight_prompt(project_data: dict, task_metrics: dict, workload_data: dict) -> str:
        """
        Builds a comprehensive prompt to analyze the entire project state and return JSON insights.
        """
        prompt = f"""
You are an advanced AI Project Management Intelligence Engine.
Analyze the following project state, task metrics, and team workload to generate intelligent insights.

Project Context:
{project_data}

Task Metrics:
{task_metrics}

Team Workload:
{workload_data}

Identify issues such as:
1. Project Delay Risk (e.g. many open tasks, low velocity)
2. Sprint Delay (e.g. current sprint ending soon but many tasks incomplete)
3. Task Bottlenecks
4. Overloaded or Idle Members
5. Missing Requirements or Documents
6. Dependency Problems

You MUST output ONLY valid JSON. Your JSON must strictly match this schema:

{{
  "insights": [
    {{
      "type": "Risk", // Must be one of: Risk, Recommendation, Deadline, Blocker, Dependency, Workload, Quality, Sprint, Requirement, Document
      "title": "Short descriptive title",
      "description": "Detailed explanation of the insight",
      "priority": "High", // Must be one of: Low, Medium, High, Critical
      "confidence": 0.94 // Float between 0 and 1
    }}
  ]
}}

Output ONLY JSON. Do not include markdown code blocks.
"""
        return prompt.strip()
