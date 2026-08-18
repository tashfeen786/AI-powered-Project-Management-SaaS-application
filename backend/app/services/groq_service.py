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
    async def generate(prompt: str, system_prompt: str = "You are a helpful AI project management assistant.", model: str = None, tools: list = None, max_tokens: int = 2048, response_format: dict = None) -> dict:
        """
        Calls Groq API to generate a response.
        Supports Llama 3, DeepSeek, Gemma (configurable via model param).
        """
        if model is None:
            model = settings.GROQ_MODEL
        if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "gsk_your_groq_api_key_here":
            logger.info("Using MOCK AI Response (No Valid API Key)")
            return {
                "text": "This is a **MOCK AI RESPONSE** because the Groq API key is missing or invalid.\n\nHere is a list:\n- Item 1\n- Item 2\n\n```python\nprint('Hello World')\n```",
                "tokens": 42,
                "model": model
            }
            
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
                "max_tokens": max_tokens,
            }
            if tools:
                kwargs["tools"] = tools
            if response_format:
                kwargs["response_format"] = response_format
                
            completion = await client.chat.completions.create(**kwargs)
            
            response_text = completion.choices[0].message.content
            tokens_used = completion.usage.total_tokens
            
            return {
                "text": response_text,
                "tokens": tokens_used,
                "model": model
            }
            
        except Exception as e:
            error_str = str(e).lower()
            if "timeout" in error_str:
                logger.error("Groq Generation Failed: Timeout", error=str(e))
                raise Exception("AI service timed out. Please try again later.")
            elif "rate_limit" in error_str or "429" in error_str:
                logger.error("Groq Generation Failed: Rate Limit Exceeded", error=str(e))
                raise Exception("AI service is currently busy. Please wait a moment and try again.")
            elif "invalid_model" in error_str or "deprecated" in error_str:
                logger.error("Groq Generation Failed: Invalid or Deprecated Model", error=str(e))
                raise Exception("The configured AI model is no longer supported. Please update the configuration.")
            elif "api_key" in error_str or "unauthorized" in error_str or "401" in error_str:
                logger.error("Groq Generation Failed: API Key Invalid", error=str(e))
                raise Exception("AI service authentication failed. Please check your API key.")
            else:
                logger.error("Groq Generation Failed", error=str(e))
                raise Exception(f"AI service encountered an error: {str(e)}")

    @staticmethod
    async def generate_stream(prompt: str, system_prompt: str = "You are a helpful AI project management assistant.", model: str = None, tools: list = None):
        if model is None:
            model = settings.GROQ_MODEL
        if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "gsk_your_groq_api_key_here":
            logger.info("Using MOCK AI Stream Response (No Valid API Key)")
            import asyncio
            mock_text = "This is a **MOCK STREAMING RESPONSE** because the Groq API key is missing or invalid.\n\n"
            mock_text += "Here is a list:\n- First element\n- Second element\n\n"
            mock_text += "### Sample Code\n```javascript\nconsole.log('Success');\n```"
            
            # Simulate streaming chunks
            for i in range(0, len(mock_text), 5):
                await asyncio.sleep(0.05)
                yield mock_text[i:i+5]
            return

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
            error_str = str(e).lower()
            if "timeout" in error_str:
                logger.error("Groq Stream Failed: Timeout", error=str(e))
                raise Exception("AI service timed out. Please try again later.")
            elif "rate_limit" in error_str or "429" in error_str:
                logger.error("Groq Stream Failed: Rate Limit Exceeded", error=str(e))
                raise Exception("AI service is currently busy. Please wait a moment and try again.")
            elif "invalid_model" in error_str or "deprecated" in error_str:
                logger.error("Groq Stream Failed: Invalid or Deprecated Model", error=str(e))
                raise Exception("The configured AI model is no longer supported. Please update the configuration.")
            elif "api_key" in error_str or "unauthorized" in error_str or "401" in error_str:
                logger.error("Groq Stream Failed: API Key Invalid", error=str(e))
                raise Exception("AI service authentication failed. Please check your API key.")
            else:
                logger.error("Groq Stream Failed", error=str(e))
                raise Exception(f"AI service encountered an error: {str(e)}")
