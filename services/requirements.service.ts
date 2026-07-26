import { apiClient } from "./api";
import { Message, SRSData } from "@/features/requirements/mock-data";

export const RequirementsService = {
  generateSrs: async (projectId: string): Promise<SRSData> => {
    const response = await apiClient.post(`/projects/${projectId}/requirements/generate`, {});
    return response.data;
  },
  getRequirements: async (projectId: string): Promise<SRSData[]> => {
    const response = await apiClient.get(`/projects/${projectId}/requirements`);
    return response.data?.items || [];
  },
  getRequirement: async (requirementId: string): Promise<SRSData> => {
    const response = await apiClient.get(`/requirements/${requirementId}`);
    return response.data;
  },
  updateRequirement: async (requirementId: string, content: string): Promise<void> => {
    await apiClient.patch(`/requirements/${requirementId}`, { generated_content: content });
  },
  approveRequirement: async (requirementId: string): Promise<void> => {
    await apiClient.post(`/requirements/${requirementId}/approve`, {});
  }
};
