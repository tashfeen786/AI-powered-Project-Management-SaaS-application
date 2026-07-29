import { apiClient } from "./api";
import {
  TaskResponse,
  TaskCreate,
  TaskUpdate,
  PaginatedData,
  StandardResponse,
  TaskQueryParams,
  TaskStatus,
} from "@/types/api";

export const TaskService = {
  getTasks: async (projectId: string, params?: TaskQueryParams): Promise<PaginatedData<TaskResponse>> => {
    const response: StandardResponse<PaginatedData<TaskResponse>> = await apiClient.get(
      `/projects/${projectId}/tasks`,
      params
    );
    return response.data ?? { items: [], total: 0, page: 1, limit: 100 };
  },

  getTask: async (taskId: string): Promise<TaskResponse> => {
    const response: StandardResponse<TaskResponse> = await apiClient.get(`/tasks/${taskId}`);
    return response.data!;
  },

  createTask: async (data: TaskCreate): Promise<TaskResponse> => {
    // Backend POST /tasks expects project_id in the body, not in the URL
    const response: StandardResponse<TaskResponse> = await apiClient.post("/tasks", data);
    return response.data!;
  },

  updateTask: async (taskId: string, data: TaskUpdate): Promise<TaskResponse> => {
    const response: StandardResponse<TaskResponse> = await apiClient.patch(`/tasks/${taskId}`, data);
    return response.data!;
  },

  updateTaskStatus: async (taskId: string, newStatus: TaskStatus): Promise<TaskResponse> => {
    const response: StandardResponse<TaskResponse> = await apiClient.patch(`/tasks/${taskId}`, { status: newStatus });
    return response.data!;
  },

  moveTask: async (taskId: string, status: string, orderIndex: number): Promise<TaskResponse> => {
    const response: StandardResponse<TaskResponse> = await apiClient.patch(`/tasks/${taskId}/move`, {
      status,
      order_index: orderIndex,
    });
    return response.data!;
  },

  assignTask: async (taskId: string, assigneeId: string | null): Promise<TaskResponse> => {
    const response: StandardResponse<TaskResponse> = await apiClient.patch(`/tasks/${taskId}/assign`, {
      assignee_id: assigneeId,
    });
    return response.data!;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}`);
  },
};
