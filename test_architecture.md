# Backend Architecture

The backend is built with FastAPI. It uses a PostgreSQL database with pgvector for vector embeddings. The embeddings are generated using an embedding service.
The system uses Celery for background tasks, such as document parsing and embedding generation.
Redis is used as the message broker for Celery and for caching.

## Features
- Authentication using JWT
- RAG using pgvector
- WebSockets for real-time AI responses

## Setup
To set up, install requirements and run uvicorn.
