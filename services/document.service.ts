import { apiClient } from "./api";
import { ProjectDocument } from "@/features/documents/mock-data";

export const DocumentService = {
  getDocuments: async (projectId: string): Promise<ProjectDocument[]> => {
    const response = await apiClient.get(`/projects/${projectId}/documents`);
    return response.data || [];
  },
  uploadDocument: async (projectId: string, file: File): Promise<ProjectDocument> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await apiClient.post(`/projects/${projectId}/documents`, formData);
    return response.data;
  },
  deleteDocument: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/documents/${documentId}`);
  }
};
