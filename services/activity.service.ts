import { apiClient } from "./api";
import { ActivityLog, PaginatedData, StandardResponse } from "@/types/api";

export const ActivityService = {
  getActivity: async (projectId: string, params?: { page?: number; limit?: number; filter_type?: string }): Promise<PaginatedData<ActivityLog>> => {
    const response: StandardResponse<PaginatedData<ActivityLog>> = await apiClient.get(
      `/projects/${projectId}/activity`,
      params
    );
    return response.data ?? { items: [], total: 0, page: 1, limit: 20 };
  },
  
  getGlobalActivity: async (params?: { page?: number; limit?: number; filter_type?: string }): Promise<PaginatedData<ActivityLog>> => {
    const response: StandardResponse<PaginatedData<ActivityLog>> = await apiClient.get(
      `/activity`,
      params
    );
    return response.data ?? { items: [], total: 0, page: 1, limit: 20 };
  },
};
