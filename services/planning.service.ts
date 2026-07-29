import { apiClient } from "./api";
import { PlanningResponse, PaginatedData, StandardResponse } from "@/types/api";

export const PlanningService = {
  generatePlan: async (projectId: string, requirementId: string, additionalContext?: string): Promise<PlanningResponse> => {
    const response: StandardResponse<PlanningResponse> = await apiClient.post(
      `/projects/${projectId}/planning/generate`,
      {
        requirement_id: requirementId,
        additional_context: additionalContext,
      }
    );
    return response.data!;
  },

  getPlans: async (projectId: string, params?: { page?: number; limit?: number }): Promise<PaginatedData<PlanningResponse>> => {
    const response: StandardResponse<PaginatedData<PlanningResponse>> = await apiClient.get(
      `/projects/${projectId}/planning`,
      params
    );
    return response.data ?? { items: [], total: 0, page: 1, limit: 10 };
  },

  getPlan: async (planId: string): Promise<PlanningResponse> => {
    const response: StandardResponse<PlanningResponse> = await apiClient.get(`/planning/${planId}`);
    return response.data!;
  },

  updatePlan: async (planId: string, payload: any): Promise<PlanningResponse> => {
    const response: StandardResponse<PlanningResponse> = await apiClient.patch(`/planning/${planId}`, payload);
    return response.data!;
  },

  deletePlan: async (planId: string): Promise<void> => {
    await apiClient.delete(`/planning/${planId}`);
  },

  approvePlan: async (planId: string): Promise<PlanningResponse> => {
    const response: StandardResponse<PlanningResponse> = await apiClient.post(`/planning/${planId}/approve`, {});
    return response.data!;
  },

  // Aliases used by hooks and pages
  getConversation: async (projectId: string): Promise<PlanningResponse[]> => {
    const data = await PlanningService.getPlans(projectId);
    return data.items;
  },

  getDraft: async (projectId: string): Promise<PlanningResponse | null> => {
    const data = await PlanningService.getPlans(projectId, { page: 1, limit: 1 });
    return data.items.length > 0 ? data.items[0] : null;
  },
};
