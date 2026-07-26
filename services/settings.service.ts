import { apiClient } from "./api";

export const SettingsService = {
  getOrganizationSettings: async (orgId: string) => {
    const response = await apiClient.get(`/organizations/${orgId}/settings`);
    return response.data;
  },
  updateOrganizationSettings: async (orgId: string, settings: any) => {
    const response = await apiClient.patch(`/organizations/${orgId}/settings`, settings);
    return response.data;
  }
};
