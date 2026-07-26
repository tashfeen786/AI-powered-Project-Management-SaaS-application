import { mockAnalyticsData, AnalyticsData } from "@/features/analytics/mock-data";

export const AnalyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    // API Contract: GET /api/v1/analytics
    return new Promise(resolve => setTimeout(() => resolve(mockAnalyticsData), 800));
  }
};
