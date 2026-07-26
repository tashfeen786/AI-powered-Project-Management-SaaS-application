# AI Project Management SaaS

A production-ready, highly modular, AI-native Project Management Platform. This software accelerates traditional agile workflows by integrating artificial intelligence directly into the Software Development Life Cycle (SDLC) — from processing raw document uploads to generating intelligent Software Requirement Specifications (SRS), mapping Sprint Plans, predicting workload bottlenecks, and actively tracking team momentum through a real-time Kanban board.

## 🌟 Features

- **Multi-Tenant Organization Management**: Isolated workspaces via strict Row-Level Security / RBAC enforcing boundaries between organizations.
- **Role-Based Access Control (RBAC)**: Comprehensive permission matrices controlling view, edit, and AI-generation capabilities for Owners, Admins, Project Managers, and Members.
- **Intelligent RAG Pipeline**: Local vector storage using `pgvector` and `SentenceTransformers`, enabling deep querying across uploaded project contexts, PDFs, DOCXs, and MDs without sending sensitive context externally.
- **AI Requirements Generator (SRS)**: Transforms sparse uploaded context into 15-point structured Agile requirement documents using Groq's high-speed LLaMA 3 inference.
- **AI Sprint Planning & Task Generation**: Ingests approved SRS documents, mathematically scopes them, maps them to Sprints, and automatically materializes them into Kanban tasks.
- **Project Intelligence Engine**: Actively watches for delayed sprints, blocked tasks, overloaded team members, and missing requirements, emitting automated risks directly to the dashboard.
- **Global AI Copilot**: A conversational assistant spanning the entire organization capable of querying real-time tasks, retrieving vector documents, and scanning conversational memory to assist users.
- **Real-Time Collaboration**: Deep WebSocket integration that tracks user presence (online/typing) and instantly broadcasts task updates across the team without aggressive polling.
- **Asynchronous Background Processing**: Celery & Redis backed queue system that ensures the UI is never blocked by heavy LLM text generation or document chunking operations.

## 🛠 Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS (Utility classes / Custom Design System via `index.css`)
- TanStack Query (React Query for asynchronous state)

**Backend**
- Python 3.11+
- FastAPI (Async framework)
- SQLAlchemy 2.0 (Async DB ORM)
- Alembic (Migrations)
- Celery (Background Workers)

**Database & Infrastructure**
- PostgreSQL (Primary Data Store)
- pgvector (Vector storage for AI Embeddings)
- Redis (Broker for WebSockets and Celery)
- Docker & Docker Compose (Container Orchestration)
- Nginx (Reverse Proxy, Load Balancing, Security Headers)
- GitHub Actions (CI/CD Pipeline)

**AI Integrations**
- Groq API (High-speed LLM inference - `llama3-70b-8192`)
- SentenceTransformers (Local lightweight embedding model - `all-MiniLM-L6-v2`)

## 📂 Architecture Overview

The system strictly adheres to **Clean Architecture**.

```
backend/
├── app/
│   ├── api/          # FastAPI routers and HTTP controllers
│   ├── core/         # Settings, Security, Celery configs, WS Manager
│   ├── models/       # SQLAlchemy 2.0 declarative base models
│   ├── schemas/      # Pydantic v2 validation and serialization schemas
│   ├── repositories/ # Data access layer (abstracts SQLAlchemy queries)
│   ├── services/     # Core business logic and prompt engineering
│   ├── tasks/        # Celery background asynchronous workers
├── scripts/          # Startup and utility scripts
├── tests/            # Pytest suites
docker/
├── nginx/            # Reverse proxy configuration
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker and Docker Compose
- Node.js 22 (for standalone frontend development)
- Python 3.11+

### 1. Environment Variables
Clone the repository and prepare your environment:
```bash
cp .env.example .env
```
Add your **Groq API Key** (`GROQ_API_KEY`) to `.env`.

### 2. Launch with Docker Compose
The entire infrastructure (PostgreSQL, Redis, FastAPI, Celery, Nginx, Next.js) boots with one command:
```bash
docker-compose up --build -d
```
- Wait ~30 seconds for the database to initialize and Alembic migrations to complete.
- **Frontend App**: `http://localhost:3000`
- **Backend API Docs**: `http://localhost:8000/docs`
- **Flower (Celery Dashboard)**: `http://localhost:5555`

## ⚙️ Production Deployment

1. Modify the `.env` file to use strong cryptographic secrets for `SECRET_KEY`, `JWT_SECRET`, and `POSTGRES_PASSWORD`.
2. Map a domain to your server's IP address.
3. Configure SSL/TLS termination either within the included Nginx container or via an external reverse proxy (e.g., AWS ALB, Cloudflare).
4. Run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d` (If using a production override file for scale parameters).

## 🔮 Future Roadmap

- **Multi-Agent Orchestration**: Introducing specialized AI agents (e.g., Code Reviewer, QA Tester) that communicate asynchronously.
- **Tool Calling Integration**: Allowing the Copilot to autonomously execute SQL queries against the Analytics engine or directly mutate Task states.
- **Push Integrations**: Hooking the `NotificationService` into native Slack, MS Teams, and Discord webhooks.
- **Kubernetes**: Migrating the current `docker-compose` topology to K8s for horizontal pod autoscaling of Celery workers based on queue depth.
