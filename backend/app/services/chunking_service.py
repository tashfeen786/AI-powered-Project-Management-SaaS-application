from app.schemas.ai import TextChunk
from typing import List, Dict, Any

# Delay import so it doesn't crash if langchain is missing
# and is only loaded when needed.
class ChunkingService:
    @staticmethod
    def chunk_text(text: str, metadata: Dict[str, Any] = None) -> List[TextChunk]:
        """
        Splits text into overlapping chunks using Langchain's RecursiveCharacterTextSplitter.
        Chunk Size: 1000
        Overlap: 200
        """
        if metadata is None:
            metadata = {}
            
        try:
            from langchain_text_splitters import RecursiveCharacterTextSplitter
            
            splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
                is_separator_regex=False,
            )
            
            chunks = splitter.split_text(text)
            
            return [
                TextChunk(chunk_index=i, text=chunk, metadata=metadata)
                for i, chunk in enumerate(chunks)
            ]
            
        except ImportError:
            # Fallback for pure python if langchain isn't installed
            import structlog
            logger = structlog.get_logger()
            logger.warning("langchain-text-splitters not installed. Using naive chunking fallback.")
            
            chunk_size = 1000
            overlap = 200
            chunks = []
            start = 0
            text_len = len(text)
            
            while start < text_len:
                end = min(start + chunk_size, text_len)
                chunks.append(text[start:end])
                if end == text_len:
                    break
                start += (chunk_size - overlap)
                
            return [
                TextChunk(chunk_index=i, text=chunk, metadata=metadata)
                for i, chunk in enumerate(chunks)
            ]
