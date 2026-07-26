from typing import List
import structlog
import numpy as np

logger = structlog.get_logger()

# Global Model Cache
_embedding_model = None

class EmbeddingService:
    @staticmethod
    def _get_model():
        """
        Loads the SentenceTransformer model globally once.
        Using all-MiniLM-L6-v2 which generates 384-dimensional embeddings.
        """
        global _embedding_model
        if _embedding_model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info("Loading sentence-transformers model (all-MiniLM-L6-v2)...")
                _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            except ImportError:
                logger.error("sentence-transformers not installed.")
                raise Exception("Sentence Transformers is not installed")
        return _embedding_model

    @staticmethod
    def generate_embedding(text: str) -> List[float]:
        """
        Generates a 384-dimensional vector embedding for a single string.
        """
        model = EmbeddingService._get_model()
        # Returns numpy array, convert to float list for pgvector
        embedding = model.encode(text)
        return embedding.tolist()
        
    @staticmethod
    def generate_embeddings_batch(texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for a batch of strings.
        Optimized for throughput.
        """
        if not texts:
            return []
            
        model = EmbeddingService._get_model()
        embeddings = model.encode(texts)
        return [emb.tolist() for emb in embeddings]
