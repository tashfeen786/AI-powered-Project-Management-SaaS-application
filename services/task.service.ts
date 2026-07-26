import { mockTasks, Task, TaskStatus } from "@/features/tasks/mock-data";

// Simple in-memory store for optimistic updates during the session
let currentTasks = [...mockTasks];

export const TaskService = {
  getTasks: async (projectId: string): Promise<Task[]> => {
    // API Contract: GET /api/v1/projects/{id}/tasks
    return new Promise(resolve => setTimeout(() => resolve([...currentTasks]), 600));
  },
  getTask: async (taskId: string): Promise<Task> => {
    // API Contract: GET /api/v1/tasks/{id}
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const t = currentTasks.find(t => t.id === taskId);
        if (t) resolve(t);
        else reject(new Error("Not found"));
      }, 300);
    });
  },
  updateTaskStatus: async (taskId: string, newStatus: TaskStatus): Promise<Task> => {
    // API Contract: PATCH /api/v1/tasks/{id}
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = currentTasks.findIndex(t => t.id === taskId);
        if (index > -1) {
          currentTasks[index] = { ...currentTasks[index], status: newStatus };
          resolve(currentTasks[index]);
        } else {
          reject(new Error("Not found"));
        }
      }, 500);
    });
  }
};
