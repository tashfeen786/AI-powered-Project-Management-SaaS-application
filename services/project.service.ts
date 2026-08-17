import { apiClient } from "./api";
import {
  ProjectResponse,
  ProjectCreate,
  ProjectUpdate,
  ProjectStatistics,
  QuickAction,
  PaginatedData,
  StandardResponse,
  ProjectQueryParams,
} from "@/types/api";

export const ProjectService = {
  getProjects: async (params?: ProjectQueryParams): Promise<PaginatedData<ProjectResponse>> => {
    const response: StandardResponse<PaginatedData<ProjectResponse>> = await apiClient.get("/projects", params);
    return response.data ?? { items: [], total: 0, page: 1, limit: 10 };
  },

  getRecentProjects: async (limit: number = 5): Promise<ProjectResponse[]> => {
    const response: StandardResponse<ProjectResponse[]> = await apiClient.get("/projects/recent", { limit });
    return response.data ?? [];
  },

  getStatistics: async (): Promise<ProjectStatistics> => {
    const response: StandardResponse<ProjectStatistics> = await apiClient.get("/projects/statistics");
    return response.data ?? { total: 0, planning: 0, active: 0, completed: 0, on_hold: 0 };
  },

  getQuickActions: async (): Promise<QuickAction[]> => {
    const response: StandardResponse<QuickAction[]> = await apiClient.get("/projects/quick-actions");
    return response.data ?? [];
  },

  getProject: async (id: string): Promise<ProjectResponse> => {
    const response: StandardResponse<ProjectResponse> = await apiClient.get(`/projects/${id}`);
    return response.data!;
  },

  createProject: async (data: ProjectCreate): Promise<ProjectResponse> => {
    const response: StandardResponse<ProjectResponse> = await apiClient.post("/projects", data);
    return response.data!;
  },

  updateProject: async (id: string, data: ProjectUpdate): Promise<ProjectResponse> => {
    const response: StandardResponse<ProjectResponse> = await apiClient.patch(`/projects/${id}`, data);
    return response.data!;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  analyzeProject: async (id: string, requirements: string): Promise<any> => {
    const response = await apiClient.post(`/projects/${id}/analyze`, { requirements });
    return response;
  },
};
