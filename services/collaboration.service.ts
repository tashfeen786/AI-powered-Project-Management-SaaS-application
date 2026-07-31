import { apiClient } from "./api";
import { StandardResponse } from "@/types/api";

export const CollaborationService = {
  toggleReaction: async (commentId: string, emoji: string) => {
    const res = await apiClient.post<StandardResponse<any>>("/collaboration/reactions", {
      comment_id: commentId,
      emoji,
    });
    return res.data;
  },

  toggleWatcher: async (taskId: string) => {
    const res = await apiClient.post<StandardResponse<any>>("/collaboration/watchers", {
      task_id: taskId,
    });
    return res.data;
  },

  uploadAttachment: async (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<StandardResponse<any>>(
      `/collaboration/tasks/${taskId}/attachments`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  getNotifications: async () => {
    const res = await apiClient.get<StandardResponse<any>>("/collaboration/notifications");
    return res.data;
  },

  markNotificationRead: async (id: string) => {
    const res = await apiClient.patch<StandardResponse<any>>(`/collaboration/notifications/${id}/read`);
    return res.data;
  },
};
