import { apiClient } from "./api";
import { SprintResponse, SprintCreate, SprintUpdate, GenerateSprintPlanRequest, PaginatedData, StandardResponse, PaginationParams } from "@/types/api";

export interface SprintQueryParams extends PaginationParams {
  status?: string;
}

export const SprintsService = {
  getSprints: async (projectId: string, params?: SprintQueryParams): Promise<PaginatedData<SprintResponse>> => {
    const response: StandardResponse<PaginatedData<SprintResponse>> = await apiClient.get(
      `/projects/${projectId}/sprints`,
      params
    );
    return response.data ?? { items: [], total: 0, page: 1, limit: 10 };
  },

  getSprint: async (sprintId: string): Promise<SprintResponse> => {
    const response: StandardResponse<SprintResponse> = await apiClient.get(`/sprints/${sprintId}`);
    return response.data!;
  },

  createSprint: async (data: SprintCreate): Promise<SprintResponse> => {
    const response: StandardResponse<SprintResponse> = await apiClient.post("/sprints", data);
    return response.data!;
  },

  updateSprint: async (sprintId: string, data: SprintUpdate): Promise<SprintResponse> => {
    const response: StandardResponse<SprintResponse> = await apiClient.patch(`/sprints/${sprintId}`, data);
    return response.data!;
  },

  deleteSprint: async (sprintId: string): Promise<void> => {
    await apiClient.delete(`/sprints/${sprintId}`);
  },

  generateSprintPlan: async (projectId: string, data: GenerateSprintPlanRequest): Promise<any> => {
    const response: StandardResponse<any> = await apiClient.post(
      `/projects/${projectId}/sprints/generate`,
      data
    );
    return response.data;
  },
};
