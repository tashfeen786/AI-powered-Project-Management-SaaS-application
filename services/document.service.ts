import { apiClient } from "./api";
import { DocumentResponse, PaginatedData, StandardResponse } from "@/types/api";

export const DocumentService = {
  getDocuments: async (projectId: string, params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedData<DocumentResponse>> => {
    const response: StandardResponse<PaginatedData<DocumentResponse>> = await apiClient.get(
      `/projects/${projectId}/documents`,
      params
    );
    return response.data ?? { items: [], total: 0, page: 1, limit: 20 };
  },

  getDocument: async (documentId: string): Promise<DocumentResponse> => {
    const response: StandardResponse<DocumentResponse> = await apiClient.get(`/documents/${documentId}`);
    return response.data!;
  },

  uploadDocument: async (projectId: string, file: File, folderPath: string = "root"): Promise<DocumentResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_path", folderPath);

    const response: StandardResponse<DocumentResponse> = await apiClient.post(
      `/projects/${projectId}/documents`,
      formData
    );
    return response.data!;
  },

  renameDocument: async (documentId: string, filename: string): Promise<DocumentResponse> => {
    const response: StandardResponse<DocumentResponse> = await apiClient.patch(`/documents/${documentId}`, {
      filename,
    });
    return response.data!;
  },

  updateDocument: async (documentId: string, updates: { filename?: string; folder_path?: string }): Promise<DocumentResponse> => {
    const response: StandardResponse<DocumentResponse> = await apiClient.patch(`/documents/${documentId}`, updates);
    return response.data!;
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/documents/${documentId}`);
  },
};
