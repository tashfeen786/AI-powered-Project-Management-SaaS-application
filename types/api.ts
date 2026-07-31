/**
 * Shared TypeScript types that mirror the FastAPI backend schemas.
 * These replace all mock-data type definitions for real API integration.
 */

// ============================================================
// Standard API Response Types
// ============================================================
export interface StandardResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface PaginatedData<T = unknown> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================
// Auth
// ============================================================
export interface Token {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  current_organization_id: string | null;
}

// ============================================================
// Organization
// ============================================================
export interface OrganizationResponse {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Project
// ============================================================
export type ProjectStatus = "Planning" | "Active" | "Review" | "Completed" | "On Hold";

export interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: string;
  progress: number;
  start_date: string | null;
  end_date: string | null;
  key: string;
  organization_id: string;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectStatistics {
  total: number;
  planning: number;
  active: number;
  completed: number;
  on_hold: number;
}

export interface QuickAction {
  id: string;
  title: string;
  action: string;
  project_id?: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  progress?: number;
  start_date?: string;
  end_date?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  progress?: number;
  start_date?: string;
  end_date?: string;
}

// ============================================================
// Task
// ============================================================
export type TaskStatus = "Backlog" | "Todo" | "In Progress" | "Review" | "Done";
export type TaskPriority = "High" | "Medium" | "Low";

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  story_points: number;
  estimated_hours: number;
  actual_hours: number;
  due_date: string | null;
  labels: string[] | null;
  sprint_id: string | null;
  project_id: string;
  organization_id: string;
  assignee_id: string | null;
  reporter_id: string | null;
  order_index: number;
  comments: any[];
  attachments: any[];
  activities: any[];
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  story_points?: number;
  estimated_hours?: number;
  due_date?: string;
  labels?: string[];
  sprint_id?: string;
  project_id: string;
  assignee_id?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  story_points?: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  labels?: string[];
  sprint_id?: string;
}

// ============================================================
// Document
// ============================================================
export type DocStatus = "Uploaded" | "Processing" | "Processed" | "Failed" | "Unsupported";

export interface DocumentResponse {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  status: DocStatus;
  project_id: string;
  organization_id: string;
  uploaded_by_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Team
// ============================================================
export type TeamRole = "owner" | "admin" | "member" | "viewer";
export type MemberStatus = "accepted" | "pending" | "rejected";

export interface TeamMemberResponse {
  id: string;
  user_id: string;
  organization_id: string;
  role: TeamRole;
  status: MemberStatus;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Copilot
// ============================================================
export interface ConversationResponse {
  id: string;
  title: string | null;
  project_id: string | null;
  organization_id: string;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface MessageResponse {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ConversationDetailResponse extends ConversationResponse {
  messages: MessageResponse[];
}

export interface GenerateRequirementRequest {
  title: string;
  additional_context?: string;
}
// Requirements
// ============================================================
export interface RequirementResponse {
  id: string;
  project_id: string;
  organization_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string | null;
  status: string;
  acceptance_criteria: string | null;
  version: number;
  confidence_score: number;
  generated_content: string | null;
  source_documents: any[];
  created_by_id: string;
  updated_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequirementCreate {
  project_id: string;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  acceptance_criteria?: string;
  generated_content?: string;
}

export interface RequirementUpdate {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  acceptance_criteria?: string;
  generated_content?: string;
}

export interface RequirementQueryParams extends PaginationParams {
  status?: string;
  priority?: string;
  sort_by?: string;
  sort_desc?: boolean;
}

// ============================================================
// Sprint Planning
// ============================================================
export interface SprintResponse {
  id: string;
  project_id: string;
  organization_id: string;
  name: string;
  goal: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  duration: number | null;
  capacity: number | null;
  team_members: string[] | null;
  velocity: number | null;
  story_points: number | null;
  ai_generated_plan: string | null;
  timeline_suggestion: string | null;
  risks_suggestion: string | null;
  created_at: string;
  updated_at: string;
}

export interface SprintCreate {
  project_id: string;
  name: string;
  goal?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  capacity?: number;
  team_members?: string[];
  velocity?: number;
  story_points?: number;
  ai_generated_plan?: string;
  timeline_suggestion?: string;
  risks_suggestion?: string;
}

export interface SprintUpdate {
  name?: string;
  goal?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  capacity?: number;
  team_members?: string[];
  velocity?: number;
  story_points?: number;
  ai_generated_plan?: string;
  timeline_suggestion?: string;
  risks_suggestion?: string;
}

export interface GenerateSprintPlanRequest {
  project_id: string;
  sprint_goal: string;
  duration: number;
  team_members: string[];
  velocity: number;
}

// ============================================================
// Planning (Legacy)
// ============================================================
export interface PlanningResponse {
  id: string;
  project_id: string;
  organization_id: string;
  requirement_id: string | null;
  generated_content: any;
  status: string;
  confidence: string | null;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Task Generation
// ============================================================
export interface TaskGenerationResponse {
  id: string;
  project_id: string;
  organization_id: string;
  generated_tasks: any;
  status: string;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// AI Insights
// ============================================================
export interface AIInsightResponse {
  id: string;
  project_id: string;
  organization_id: string;
  insight_type: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Jobs
// ============================================================
export interface JobResponse {
  id: string;
  job_type: string;
  status: string;
  progress: number;
  result: any;
  error: string | null;
  organization_id: string;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Analytics (placeholder — backend returns empty object for now)
// ============================================================
export interface AnalyticsData {
  [key: string]: any;
}

// ============================================================
// Settings (placeholder — backend returns empty object for now)
// ============================================================
export interface SettingsData {
  [key: string]: any;
}

// ============================================================
// Activity
// ============================================================
export interface ActivityLog {
  [key: string]: any;
}

// ============================================================
// Pagination & Query Params
// ============================================================
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export interface ProjectQueryParams extends PaginationParams {
  status?: string;
  priority?: string;
}

export interface TaskQueryParams extends PaginationParams {
  status?: string;
  priority?: string;
  assignee_id?: string;
  sprint_id?: string;
}
