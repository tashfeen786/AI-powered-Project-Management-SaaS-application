import { apiClient } from "./api";
import { TaskGenerationResponse, StandardResponse } from "@/types/api";

export const TaskGenerationService = {
  generateTasks: async (projectId: string, data?: { requirement_id?: string; planning_id?: string }): Promise<TaskGenerationResponse> => {
    const response: StandardResponse<TaskGenerationResponse> = await apiClient.post(
      `/projects/${projectId}/tasks/generate`,
      data ?? {}
    );
    return response.data!;
  },

  getGenerations: async (projectId: string): Promise<TaskGenerationResponse[]> => {
    const response: StandardResponse<TaskGenerationResponse[]> = await apiClient.get(
      `/projects/${projectId}/task-generation`
    );
    return response.data ?? [];
  },

  approveGeneration: async (generationId: string): Promise<TaskGenerationResponse> => {
    const response: StandardResponse<TaskGenerationResponse> = await apiClient.post(
      `/task-generation/${generationId}/approve`,
      {}
    );
    return response.data!;
  },
};
