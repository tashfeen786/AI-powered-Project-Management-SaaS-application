class PromptService:
    @staticmethod
    def build_rag_prompt(query: str, context_chunks: list) -> str:
        """
        Combines the user query with retrieved RAG context.
        """
        context_text = "\n\n---\n\n".join(
            [f"Document Fragment:\n{chunk['text']}" for chunk in context_chunks]
        )
        
        prompt = f"""
You are answering a question based strictly on the following provided project context.
If the answer cannot be found in the context, state that you do not have enough information. Do not invent answers.

Context:
{context_text}

User Question:
{query}

Answer:"""
        return prompt.strip()
