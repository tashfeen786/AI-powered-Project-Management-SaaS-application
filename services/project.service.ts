import { apiClient } from "./api";
import { mockProjectsDetail, ProjectDetail } from "@/features/projects/mock-projects";

export const ProjectService = {
  getProjects: async (): Promise<ProjectDetail[]> => {
    // API Contract: GET /api/v1/projects
    // await apiClient.get('/projects');
    return new Promise((resolve) => setTimeout(() => resolve(mockProjectsDetail), 500));
  },
  getProject: async (id: string): Promise<ProjectDetail> => {
    // API Contract: GET /api/v1/projects/{id}
    // await apiClient.get(`/projects/${id}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const project = mockProjectsDetail.find(p => p.id === id);
        if (project) resolve(project);
        else reject(new Error("Project not found"));
      }, 500);
    });
  },
  createProject: async (data: Partial<ProjectDetail>): Promise<ProjectDetail> => {
    // API Contract: POST /api/v1/projects
    return new Promise((resolve) => setTimeout(() => resolve(mockProjectsDetail[0]), 500));
  },
  updateProject: async (id: string, data: Partial<ProjectDetail>): Promise<ProjectDetail> => {
    // API Contract: PATCH /api/v1/projects/{id}
    return new Promise((resolve) => setTimeout(() => resolve(mockProjectsDetail[0]), 500));
  },
  deleteProject: async (id: string): Promise<void> => {
    // API Contract: DELETE /api/v1/projects/{id}
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
};
