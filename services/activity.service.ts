import { mockActivity, ActivityLog } from "@/features/activity/mock-data";

export const ActivityService = {
  getActivity: async (projectId: string): Promise<ActivityLog[]> => {
    // API Contract: GET /api/v1/projects/{id}/activity
    return new Promise(resolve => setTimeout(() => resolve([...mockActivity]), 600));
  }
};
