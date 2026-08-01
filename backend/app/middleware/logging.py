import time
import structlog

logger = structlog.get_logger()

class LoggingMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)

        start_time = time.time()
        method = scope.get("method", "")
        path = scope.get("path", "")
        query_string = scope.get("query_string", b"").decode()
        url = f"{path}?{query_string}" if query_string else path

        # Intercept the send to capture status code
        status_code = [500]
        
        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                status_code[0] = message["status"]
                headers = message.get("headers", [])
                process_time = time.time() - start_time
                headers.append((b"x-process-time", str(process_time).encode("utf-8")))
                message["headers"] = headers
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
            process_time = time.time() - start_time
            logger.info("Request completed", 
                        method=method, 
                        url=url, 
                        status_code=status_code[0], 
                        duration=f"{process_time:.4f}s")
        except Exception as e:
            process_time = time.time() - start_time
            logger.error("Request failed", 
                         method=method, 
                         url=url, 
                         error=str(e), 
                         duration=f"{process_time:.4f}s")
            raise e
