import { apiClient } from "./api";

export const AnalyticsService = {
  getProjectAnalytics: async (projectId: string) => {
    const response = await apiClient.get(`/projects/${projectId}/analytics`);
    return response.data;
  },
  getProjectInsights: async (projectId: string) => {
    const response = await apiClient.get(`/projects/${projectId}/insights`);
    return response.data;
  },
  generateInsights: async (projectId: string) => {
    const response = await apiClient.post(`/projects/${projectId}/insights/generate`, {});
    return response.data;
  }
};
