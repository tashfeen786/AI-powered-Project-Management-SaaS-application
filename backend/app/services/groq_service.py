from app.core.config import settings
import structlog

logger = structlog.get_logger()

# Global Groq Client
_groq_client = None

class GroqService:
    @staticmethod
    def _get_client():
        global _groq_client
        if _groq_client is None:
            try:
                from groq import AsyncGroq
                if not settings.GROQ_API_KEY:
                    logger.warning("GROQ_API_KEY is missing. AI generations will fail.")
                _groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
            except ImportError:
                logger.error("groq package not installed.")
                raise Exception("Groq is not installed")
        return _groq_client

    @staticmethod
    async def generate(prompt: str, system_prompt: str = "You are a helpful AI project management assistant.", model: str = "llama3-70b-8192", tools: list = None) -> dict:
        """
        Calls Groq API to generate a response.
        Supports Llama 3, DeepSeek, Gemma (configurable via model param).
        """
        client = GroqService._get_client()
        
        logger.info("Calling Groq", model=model, prompt_length=len(prompt))
        
        try:
            kwargs = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 2048,
            }
            if tools:
                kwargs["tools"] = tools
                
            completion = await client.chat.completions.create(**kwargs)
            
            response_text = completion.choices[0].message.content
            tokens_used = completion.usage.total_tokens
            
            return {
                "text": response_text,
                "tokens": tokens_used,
                "model": model
            }
            
        except Exception as e:
            logger.error("Groq Generation Failed", error=str(e))
            raise e

    @staticmethod
    async def generate_stream(prompt: str, system_prompt: str = "You are a helpful AI project management assistant.", model: str = "llama3-70b-8192", tools: list = None):
        client = GroqService._get_client()
        logger.info("Calling Groq Stream", model=model)
        
        try:
            kwargs = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 2048,
                "stream": True
            }
            if tools:
                kwargs["tools"] = tools
                
            stream = await client.chat.completions.create(**kwargs)
            
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error("Groq Stream Failed", error=str(e))
            raise e
