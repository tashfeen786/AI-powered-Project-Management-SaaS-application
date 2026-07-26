import { apiClient } from "./api";
import { Message, PlanningData } from "@/features/planning/mock-data";

export const PlanningService = {
  generatePlan: async (projectId: string, requirementId: string, additionalContext?: string): Promise<PlanningData> => {
    const response = await apiClient.post(`/projects/${projectId}/planning/generate`, {
      requirement_id: requirementId,
      additional_context: additionalContext
    });
    return response.data;
  },
  getPlans: async (projectId: string): Promise<PlanningData[]> => {
    const response = await apiClient.get(`/projects/${projectId}/planning`);
    return response.data?.items || [];
  },
  getPlan: async (planId: string): Promise<PlanningData> => {
    const response = await apiClient.get(`/planning/${planId}`);
    return response.data;
  },
  updatePlan: async (planId: string, payload: any): Promise<void> => {
    await apiClient.patch(`/planning/${planId}`, payload);
  },
  approvePlan: async (planId: string): Promise<void> => {
    await apiClient.post(`/planning/${planId}/approve`, {});
  }
};
