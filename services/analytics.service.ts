import { apiClient } from "./api";
import { AIInsightResponse, StandardResponse } from "@/types/api";

export const AnalyticsService = {
  /**
   * Get org-level analytics. Backend route: GET /analytics
   */
  getAnalytics: async (): Promise<any> => {
    const response: StandardResponse<any> = await apiClient.get("/analytics");
    return response.data ?? {};
  },

  /**
   * Get project-specific AI insights. Backend route: GET /projects/{projectId}/insights
   */
  getProjectInsights: async (projectId: string): Promise<AIInsightResponse[]> => {
    const response: StandardResponse<AIInsightResponse[]> = await apiClient.get(
      `/projects/${projectId}/insights`
    );
    return response.data ?? [];
  },

  /**
   * Generate AI insights. Backend route: POST /projects/{projectId}/insights/generate
   */
  generateInsights: async (projectId: string): Promise<AIInsightResponse[]> => {
    const response: StandardResponse<AIInsightResponse[]> = await apiClient.post(
      `/projects/${projectId}/insights/generate`,
      {}
    );
    return response.data ?? [];
  },

  /**
   * Resolve an insight. Backend route: PATCH /insights/{id}/resolve
   */
  resolveInsight: async (insightId: string, status: string): Promise<AIInsightResponse> => {
    const response: StandardResponse<AIInsightResponse> = await apiClient.patch(
      `/insights/${insightId}/resolve`,
      { status }
    );
    return response.data!;
  },

  /**
   * Get project workload analysis. Backend route: GET /projects/{projectId}/workload
   */
  getProjectWorkload: async (projectId: string): Promise<any> => {
    const response: StandardResponse<any> = await apiClient.get(`/projects/${projectId}/workload`);
    return response.data ?? {};
  },
};
