import { apiClient } from "./api";
import { ActivityLog, StandardResponse } from "@/types/api";

export const ActivityService = {
  getActivity: async (projectId: string): Promise<ActivityLog[]> => {
    // Backend route: GET /projects/{project_id}/activity
    const response: StandardResponse<ActivityLog[]> = await apiClient.get(
      `/projects/${projectId}/activity`
    );
    return response.data ?? [];
  },
};
