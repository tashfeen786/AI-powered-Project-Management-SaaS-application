import time
import structlog
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = structlog.get_logger()

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Add request info to logger context if needed
        # structlog.contextvars.bind_contextvars(request_id=request.headers.get("X-Request-ID"))
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            logger.info("Request completed", 
                        method=request.method, 
                        url=str(request.url), 
                        status_code=response.status_code, 
                        duration=f"{process_time:.4f}s")
            response.headers["X-Process-Time"] = str(process_time)
            return response
        except Exception as e:
            process_time = time.time() - start_time
            logger.error("Request failed", 
                         method=request.method, 
                         url=str(request.url), 
                         error=str(e), 
                         duration=f"{process_time:.4f}s")
            raise e
