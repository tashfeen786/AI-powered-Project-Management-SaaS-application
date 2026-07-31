import { apiClient } from "./api";
import { RequirementResponse, PaginatedData, StandardResponse, RequirementCreate, RequirementUpdate, GenerateRequirementRequest, RequirementQueryParams } from "@/types/api";

export const RequirementsService = {
  generateRequirement: async (projectId: string, request: GenerateRequirementRequest): Promise<RequirementResponse> => {
    const response: StandardResponse<RequirementResponse> = await apiClient.post(
      `/projects/${projectId}/requirements/generate`,
      request
    );
    return response.data!;
  },

  getRequirements: async (projectId: string, params?: RequirementQueryParams): Promise<PaginatedData<RequirementResponse>> => {
    const response: StandardResponse<PaginatedData<RequirementResponse>> = await apiClient.get(
      `/projects/${projectId}/requirements`,
      params
    );
    return response.data ?? { items: [], total: 0, page: 1, limit: 10 };
  },

  getRequirement: async (requirementId: string): Promise<RequirementResponse> => {
    const response: StandardResponse<RequirementResponse> = await apiClient.get(`/requirements/${requirementId}`);
    return response.data!;
  },

  createRequirement: async (data: RequirementCreate): Promise<RequirementResponse> => {
    const response: StandardResponse<RequirementResponse> = await apiClient.post("/requirements", data);
    return response.data!;
  },

  updateRequirement: async (requirementId: string, data: RequirementUpdate): Promise<RequirementResponse> => {
    const response: StandardResponse<RequirementResponse> = await apiClient.patch(`/requirements/${requirementId}`, data);
    return response.data!;
  },

  deleteRequirement: async (requirementId: string): Promise<void> => {
    await apiClient.delete(`/requirements/${requirementId}`);
  },

  // Aliases used by hooks and pages
  getConversation: async (projectId: string): Promise<RequirementResponse[]> => {
    // Reuse getRequirements — the conversation is derived from the requirement history
    const data = await RequirementsService.getRequirements(projectId);
    return data.items;
  },

  getDraft: async (projectId: string): Promise<RequirementResponse | null> => {
    // Get the most recent requirement for this project as the "draft"
    const data = await RequirementsService.getRequirements(projectId, { page: 1, limit: 1 });
    return data.items.length > 0 ? data.items[0] : null;
  },

  updateDraft: async (projectId: string, sectionId: string, content: string): Promise<void> => {
    // Get the latest requirement, then patch its content
    const draft = await RequirementsService.getDraft(projectId);
    if (draft) {
      await RequirementsService.updateRequirement(draft.id, { generated_content: content });
    }
  },

  approveDraft: async (projectId: string): Promise<void> => {
    // Get the latest requirement, then approve it
    const draft = await RequirementsService.getDraft(projectId);
    if (draft) {
      await apiClient.post(`/requirements/${draft.id}/approve`, {});
    }
  },

  approveRequirement: async (requirementId: string): Promise<void> => {
    await apiClient.post(`/requirements/${requirementId}/approve`, {});
  },
};
