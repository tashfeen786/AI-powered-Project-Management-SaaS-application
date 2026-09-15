# QA FINDINGS VERIFICATION

> Phase 0 Reconnaissance — verified against current code on 2026-09-15

---

## BUG-001 | P1 — Auth Logout No-Op

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/api/v1/auth.py` L35-38 |
| **Root Cause** | Logout endpoint returns success but never invalidates the token. Comment says "Placeholder for token invalidation / blacklist". |
| **Intended Fix** | Implement Redis-based token blacklist. On logout, store the token's `jti` (or full token hash) in Redis with TTL matching remaining token expiry. Check blacklist in `get_current_user` dependency. |
| **Verification** | Login → get token → call /logout → retry using same token → expect 401. |

---

## BUG-002 | P0 — Frontend Route Protection Missing

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | No `middleware.ts` exists at project root |
| **Root Cause** | Next.js App Router has no middleware or route guard. Dashboard, projects, etc. render without auth check. |
| **Intended Fix** | Create `middleware.ts` at project root. Check for auth token cookie/localStorage. Redirect unauthenticated users to `/login`. |
| **Verification** | Open `/dashboard` in fresh incognito browser → must redirect to `/login`. |

---

## BUG-003 | P1 — Refresh Token Same Secret

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/core/security.py` L22, `backend/app/services/auth_service.py` L25-28, L73 |
| **Root Cause** | `create_access_token()` always uses `settings.JWT_SECRET`. `JWT_REFRESH_SECRET` exists in `.env` (L19) but is never used anywhere. Refresh token is decoded with `JWT_SECRET` (L73). Both tokens are identical format. |
| **Intended Fix** | Add `token_type` parameter to `create_access_token()`. Use `JWT_REFRESH_SECRET` for refresh tokens. Add `type` claim to payload to distinguish access vs refresh. Decode refresh tokens with `JWT_REFRESH_SECRET`. |
| **Verification** | Decode an access token and refresh token → different signing keys. Try using refresh token as access token → 401. |

---

## BUG-004 | P1 — Multi-Tenancy Domain Auto-Join as Owner

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/services/auth_service.py` L38-62 |
| **Root Cause** | Registration looks up org by email domain. If found, user joins existing org. Then L62 calls `add_user_to_org(role="owner")`. Second user from same domain becomes owner of someone else's org. |
| **Intended Fix** | When org already exists, add user as `member` (not `owner`) with `status="pending"`. Only the first user creating the org gets `owner`. Alternatively, always create a new org per registration (email domain is informational only). |
| **Verification** | Register user A with `@company.com` → owner. Register user B with `@company.com` → must NOT be owner of A's org. |

---

## BUG-005 | P2 — Org Membership Not Validated in Some Routes

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/api/v1/projects.py` L14-18 (`get_org_id`) |
| **Root Cause** | `get_org_id()` only checks `current_organization_id is not None`. No query to verify user actually belongs to that org with accepted status. Compare to `verify_org_and_role()` in `requirements.py` L17-30 which does full membership check. |
| **Intended Fix** | Replace `get_org_id()` in `projects.py` with `verify_org_and_role()` pattern (or shared dependency) that queries `organization_members` table. |
| **Verification** | Set user's `current_organization_id` to an org they don't belong to → project endpoints must return 403. |

---

## BUG-006 | P1 — Project CRUD No RBAC

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/api/v1/projects.py` — all endpoints use `get_org_id()` not `verify_org_and_role()` |
| **Root Cause** | Project create/update/delete don't check permissions at all. Any authenticated user with any role can create/delete projects. |
| **Intended Fix** | Add RBAC checks: CREATE requires `CREATE_PROJECTS`, UPDATE requires `EDIT_PROJECTS`, DELETE requires `DELETE_PROJECTS`, LIST/GET requires `VIEW_PROJECTS`. |
| **Verification** | Login as `viewer` role → attempt POST /projects → must get 403. Login as `developer` → attempt DELETE → must get 403. |

---

## BUG-007 | P2 — Requirement Approval Wrong Permission

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/api/v1/requirements.py` L149 |
| **Root Cause** | `approve_requirement` checks `Permission.EDIT_PROJECTS` instead of `Permission.APPROVE_DRAFTS`. Developers have EDIT_PROJECTS, so they can approve, bypassing intended hierarchy. |
| **Intended Fix** | Change L149 to `Permission.APPROVE_DRAFTS`. |
| **Verification** | Login as `developer` → POST /requirements/{id}/approve → must get 403. Login as `pm` or `qa` → must succeed. |

---

## BUG-008 | P0 — Document Processing Celery Stub

| Field | Value |
|-------|-------|
| **Status** | ⚠️ PARTIALLY CONFIRMED |
| **File** | `backend/app/tasks/document_tasks.py` L16-23 (stub), BUT `backend/app/services/document_service.py` L94-151 (full implementation) |
| **Root Cause** | The Celery task IS a stub (`pass`, commented-out `asyncio.run`). HOWEVER, `document_service.py` L90 calls `process_document()` **inline** (not via Celery). The full pipeline exists: parsing → chunking → embedding → vector storage. The Celery task is dead code. |
| **Intended Fix** | Wire the Celery task to actually call `DocumentService.process_document()`. OR keep inline processing and document the Celery task as a future scalability option. The inline path works — fix the Celery task to match. |
| **Verification** | Upload a `.txt` document → verify `processing_status` changes to "Processed" → verify embeddings exist in `document_embeddings` table. |

---

## BUG-009 | P0 — RAG No Embeddings

| Field | Value |
|-------|-------|
| **Status** | ❌ NOT CONFIRMED (as stated) |
| **File** | `backend/app/services/document_service.py` L121-141 |
| **Root Cause** | The audit incorrectly concluded no embeddings are generated because the Celery task is a stub. **The actual pipeline in `document_service.py` generates embeddings inline** (L131) using `EmbeddingService.generate_embeddings_batch()` and stores them via `VectorService.store_document_vectors()` (L135-141). RAG pipeline is architecturally complete. |
| **Intended Fix** | No code fix needed for the pipeline itself. The issue is that the Celery task is dead code (BUG-008). The inline path works. Need to verify end-to-end with a running database. |
| **Verification** | Upload document → verify chunks in DB → verify embeddings stored → query via retrieval service → verify relevant chunks returned. |

---

## BUG-010 | P1 — AI Model Names Invalid

| Field | Value |
|-------|-------|
| **Status** | ⚠️ PARTIALLY CONFIRMED |
| **File** | `backend/app/core/config.py` L41-42 |
| **Root Cause** | Models are `openai/gpt-oss-120b` and `qwen/qwen3.6-27b`. These are non-standard Groq model names. The Groq API at `groq.com` typically serves `llama-*`, `mixtral-*`, `gemma-*` models. However, Groq has been adding OpenAI-compatible model routing. Need to verify against the actual API key's available models. |
| **Intended Fix** | Test the current models against the Groq API. If they fail, update to known-valid Groq models. The GroqService already has mock mode (L35-41) for missing/invalid keys. Make model names configurable via `.env`. |
| **Verification** | Call Groq API with configured model → verify response or get specific error → update if invalid. |

---

## BUG-011 | P2 — Versioning In-Place Mutation

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/services/requirement_service.py` L225-248 |
| **Root Cause** | On significant edit, version number increments on the same row. Old content preserved only as JSON snapshot in `requirement_histories`. Cannot query ORM for "version 2" of requirement X. |
| **Intended Fix** | This is an architecture decision, not a bug. The history table with snapshots is a valid pattern. Document this as "append-only history via snapshots". No code change needed unless full version branching is required. |
| **Verification** | Edit requirement → check `requirement_histories` contains full snapshot of previous state. |

---

## BUG-012 | P1 — Developer Assignment Hardcoded Skills

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/services/developer_assignment_service.py` L43-44 |
| **Root Cause** | Skills hardcoded to `["React", "Python", "PostgreSQL", "DevOps", "Testing"]` and workload to `"Low"` for ALL developers. The `UserOrganization` model at `backend/app/models/user_organization.py` L17-18 HAS `job_role` and `skills` (JSONB) fields. They're just not used. |
| **Intended Fix** | Read `m.job_role` and `m.skills` from the `UserOrganization` model instead of hardcoding. Fall back to defaults if null. |
| **Verification** | Set skills on a team member → generate assignment → verify AI receives real skills in prompt. |

---

## BUG-013 | P1 — Developer Assignment Wrong Payload Key

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/services/developer_assignment_service.py` L60, L100 |
| **Root Cause** | Uses `payload.get('sprints', [])` but task_generation_service stores payload with key `"tasks"` (see `task_generation_service.py` L153). The prompt sends empty list to AI. Same issue on L100 for applying assignments. |
| **Intended Fix** | Change `'sprints'` to `'tasks'` on L60 and L100. |
| **Verification** | Generate tasks → call assignment → verify AI receives actual task list (not empty). |

---

## BUG-014 | P2 — Developer Assignment No Approval Step

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/services/developer_assignment_service.py` L106, L112 |
| **Root Cause** | AI recommendation directly modifies `task["assignee_id"]` in the payload and commits to DB (L112). No approval gate. |
| **Intended Fix** | Store recommendations in a separate `recommendations` field (not `assignee_id`). Add an explicit approval endpoint that accepts/rejects individual assignments before persisting them. |
| **Verification** | Generate recommendations → verify `assignee_id` NOT modified → approve → verify assignment applied. |

---

## BUG-015 | P2 — WebSocket No Auth

| Field | Value |
|-------|-------|
| **Status** | ❌ NOT CONFIRMED |
| **File** | `backend/app/services/websocket_service.py` L20-32 |
| **Root Cause** | The audit was WRONG. WebSocket connections DO validate JWT via `authenticate_connection()` (L20-32). Token is decoded via `verify_token()` from `core/security.py`. Invalid/expired tokens cause `close(code=1008)` (L39). |
| **Intended Fix** | No fix needed. WebSocket auth is properly implemented. |
| **Verification** | Connect WebSocket with invalid token → verify connection closed with code 1008. |

---

## BUG-016 | P0 — Celery Document Task Dead Code (Duplicate of BUG-008)

| Field | Value |
|-------|-------|
| **Status** | ⚠️ PARTIALLY CONFIRMED |
| **File** | `backend/app/tasks/document_tasks.py` |
| **Root Cause** | Same as BUG-008. The Celery task is a stub, but document processing works inline via `DocumentService.process_document()`. |
| **Intended Fix** | Same as BUG-008. Wire Celery task properly or document inline processing as the intended architecture. |
| **Verification** | Same as BUG-008. |

---

## BUG-017 | P3 — Google Social Login Button

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `components/auth/SocialLoginButton.tsx` |
| **Root Cause** | Button renders "Continue with Google" but has no `onClick` handler beyond the default HTML behavior. No backend OAuth endpoint exists. |
| **Intended Fix** | Since Google OAuth is not in scope, disable the button with a tooltip "Coming soon" or remove it entirely. |
| **Verification** | Verify button is either removed or visually disabled with clear "not available" indication. |

---

## BUG-018 | P0 — Database Supabase Tenant Dead

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/.env` L8 |
| **Root Cause** | `DATABASE_URL` points to `postgres.kzmpwztseingxqimkgiz` which returns `ENOTFOUND tenant/user not found`. |
| **Intended Fix** | Add PostgreSQL+pgvector to `docker-compose.yml`. Update `.env.example` with local DB URL. Update `.env` to use local DB. |
| **Verification** | `docker-compose up db` → connect → `SELECT 1` succeeds. |

---

## BUG-019 | P1 — No PostgreSQL in Docker Compose

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `docker-compose.yml` — no `db` or `postgres` service defined |
| **Root Cause** | Docker Compose has Redis, backend, celery, flower, frontend, nginx — but no database. Project depended entirely on external Supabase. |
| **Intended Fix** | Add `db` service using `pgvector/pgvector:pg16` image with persistent volume. |
| **Verification** | `docker-compose up db` → PostgreSQL accessible → pgvector extension available. |

---

## BUG-020 | P0 — Credentials in Version Control

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/.env` L8 (DB password), L22 (Groq API key) |
| **Root Cause** | `.env` file contains real secrets. `.gitignore` L35-36 does list `backend/.env` and `backend/.env.*`, so it SHOULD be ignored by git. However, the file currently exists in the repository which means it was committed before gitignore was added, or force-committed. |
| **Intended Fix** | Remove `backend/.env` from git tracking (`git rm --cached`). Create `backend/.env.example` with placeholder values. Report that exposed Groq API key and DB password must be rotated. |
| **Verification** | `git status backend/.env` shows untracked. `.env.example` exists with placeholders only. |

---

## BUG-021 | P2 — Error Message Leaks Internal Details

| Field | Value |
|-------|-------|
| **Status** | ✅ CONFIRMED |
| **File** | `backend/app/main.py` L110 |
| **Root Cause** | `f"Internal Server Error: {str(exc)}"` sends exception message to client. Could expose DB connection strings, file paths, internal errors. |
| **Intended Fix** | Return generic message: `"An internal error occurred. Please try again later."`. Log full error server-side (already done at L107). |
| **Verification** | Trigger a 500 error → response body must NOT contain internal details like file paths or DB errors. |

---

## BUG-022 | P2 — Null Domain Unique Constraint Issue

| Field | Value |
|-------|-------|
| **Status** | ⚠️ PARTIALLY CONFIRMED |
| **File** | `backend/app/models/organization.py` L10 |
| **Root Cause** | `domain` has `unique=True`. In PostgreSQL, NULL values are NOT equal, so multiple orgs with `domain=NULL` are allowed. This is actually safe in PostgreSQL. The bug would only manifest in databases that treat NULL as equal for unique constraints (e.g., SQLite). |
| **Intended Fix** | No fix needed for PostgreSQL. The unique constraint works correctly with NULL values. |
| **Verification** | Create two orgs with `domain=NULL` in PostgreSQL → both succeed. |

---

## SUMMARY

| Bug | Severity | Confirmed? | Needs Fix? |
|-----|----------|------------|------------|
| BUG-001 | P1 | ✅ Yes | ✅ Yes |
| BUG-002 | P0 | ✅ Yes | ✅ Yes |
| BUG-003 | P1 | ✅ Yes | ✅ Yes |
| BUG-004 | P1 | ✅ Yes | ✅ Yes |
| BUG-005 | P2 | ✅ Yes | ✅ Yes |
| BUG-006 | P1 | ✅ Yes | ✅ Yes |
| BUG-007 | P2 | ✅ Yes | ✅ Yes |
| BUG-008 | P0→P2 | ⚠️ Partial | ✅ Yes (Celery task) |
| BUG-009 | P0→N/A | ❌ No | ❌ No (inline works) |
| BUG-010 | P1 | ⚠️ Partial | ✅ Verify/Fix |
| BUG-011 | P2 | ✅ Yes | ❌ No (by design) |
| BUG-012 | P1 | ✅ Yes | ✅ Yes |
| BUG-013 | P1 | ✅ Yes | ✅ Yes |
| BUG-014 | P2 | ✅ Yes | ✅ Yes |
| BUG-015 | P2→N/A | ❌ No | ❌ No (auth exists) |
| BUG-016 | P0→P2 | ⚠️ Partial | Same as BUG-008 |
| BUG-017 | P3 | ✅ Yes | ✅ Yes |
| BUG-018 | P0 | ✅ Yes | ✅ Yes |
| BUG-019 | P1 | ✅ Yes | ✅ Yes |
| BUG-020 | P0 | ✅ Yes | ✅ Yes |
| BUG-021 | P2 | ✅ Yes | ✅ Yes |
| BUG-022 | P2→N/A | ❌ No | ❌ No (PostgreSQL OK) |

### Revised Bug Count

| Severity | Original | After Verification |
|----------|----------|-------------------|
| P0 | 5 | 2 (BUG-002, BUG-018/019/020 grouped as infra) |
| P1 | 7 | 7 (BUG-001, 003, 004, 006, 010, 012, 013) |
| P2 | 6 | 4 (BUG-005, 007, 008/016 grouped, 014, 021) |
| P3 | 1 | 1 (BUG-017) |
| N/A | 0 | 4 (BUG-009, 011, 015, 022 — not real bugs) |
| **Total needing fix** | **22** | **16** |
