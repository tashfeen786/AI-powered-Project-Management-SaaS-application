# Phase 4 Implementation: Documents and Activity

## Backend Architecture
- **Activity System**: Created `ActivityRepository` and `ActivityService` to store and paginate real `ActivityLog` events. Hooks have been added into `TaskService`, `ProjectService`, `RequirementService`, `SprintService`, and `DocumentService` to emit these structured activity logs.
- **Document Enhancements**: Added `folder_path` and `version` columns to the `Document` SQLAlchemy model. 
- **Expanded File Support**: Updated `ALLOWED_EXTENSIONS` in `DocumentService` to support PDF, DOCX, TXT, Markdown, and Images (PNG, JPG, JPEG, GIF, WEBP).
- **APIs**: Restructured `/projects/{project_id}/activity` and `/projects/{project_id}/documents` routes to use FastAPI `Query` pagination and filter params.

## Frontend Infrastructure
- **Infinite Scrolling**: Converted `useActivity` to leverage `@tanstack/react-query`'s `useInfiniteQuery`. This efficiently processes `getNextPageParam` for infinite scrolling on the timeline.
- **Document Management**: Added `useUpdateDocument` hook for renaming documents and updated `useUploadDocument` to support folder allocations.
- **Type Safety**: Mapped all frontend interfaces (`ActivityLog`, `DocumentResponse`) to their exact backend schema shapes in `types/api.ts`.

## UI Integration
- **Activity Timeline**: Transformed `ActivityItem` and `ActivityTimeline` to map real backend payloads. Added a "Load More" mechanism and robust date/string formatters to display events gracefully.
- **Document Workspace**: Wired the Drag & Drop zone to perform real multi-part uploads with optimistic progress indicators. Built an inline Rename flow directly inside the `DocumentPreview` overlay.
- **Folders & Search**: Upgraded `DocumentToolbar` to support search text filtering and virtual `folder_path` category filtering.

## Next Steps Before Running
Since new columns (`folder_path` and `version`) were added to the `Document` model, please generate and run the database migrations:

```bash
cd backend
poetry run alembic revision --autogenerate -m "Add document folders and versions"
poetry run alembic upgrade head
```
