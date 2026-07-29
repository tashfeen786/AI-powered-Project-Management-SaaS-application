import { apiClient } from "./api";
import { OrganizationResponse, StandardResponse } from "@/types/api";

export const OrganizationService = {
  getMyOrganizations: async (): Promise<OrganizationResponse[]> => {
    const response: StandardResponse<OrganizationResponse[]> = await apiClient.get("/organizations");
    return response.data ?? [];
  },

  getCurrentOrganization: async (): Promise<OrganizationResponse> => {
    const response: StandardResponse<OrganizationResponse> = await apiClient.get("/organizations/current");
    return response.data!;
  },

  createOrganization: async (data: { name: string }): Promise<OrganizationResponse> => {
    const response: StandardResponse<OrganizationResponse> = await apiClient.post("/organizations", data);
    return response.data!;
  },

  updateOrganization: async (orgId: string, data: { name?: string }): Promise<OrganizationResponse> => {
    const response: StandardResponse<OrganizationResponse> = await apiClient.patch(`/organizations/${orgId}`, data);
    return response.data!;
  },

  switchOrganization: async (organizationId: string): Promise<OrganizationResponse> => {
    const response: StandardResponse<OrganizationResponse> = await apiClient.post("/organizations/switch", {
      organization_id: organizationId,
    });
    return response.data!;
  },
};
