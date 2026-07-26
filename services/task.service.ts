import { apiClient } from "./api";
import { Task, TaskStatus } from "@/features/tasks/mock-data";

export const TaskService = {
  getTasks: async (projectId: string): Promise<Task[]> => {
    const response = await apiClient.get(`/projects/${projectId}/tasks`);
    return response.data || [];
  },
  getTask: async (taskId: string): Promise<Task> => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },
  updateTaskStatus: async (taskId: string, newStatus: TaskStatus): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${taskId}`, { status: newStatus });
    return response.data;
  },
  createTask: async (projectId: string, data: Partial<Task>): Promise<Task> => {
    const response = await apiClient.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },
  deleteTask: async (taskId: string): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}`);
  }
};
