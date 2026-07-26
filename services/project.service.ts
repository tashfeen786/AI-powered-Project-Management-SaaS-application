import { apiClient } from "./api";
import { ProjectDetail } from "@/features/projects/mock-projects";

export const ProjectService = {
  getProjects: async (): Promise<ProjectDetail[]> => {
    const response = await apiClient.get('/projects');
    // Assuming backend returns StandardResponse with data array
    return response.data || [];
  },
  getProject: async (id: string): Promise<ProjectDetail> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
  createProject: async (data: Partial<ProjectDetail>): Promise<ProjectDetail> => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },
  updateProject: async (id: string, data: Partial<ProjectDetail>): Promise<ProjectDetail> => {
    const response = await apiClient.patch(`/projects/${id}`, data);
    return response.data;
  },
  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  }
};
