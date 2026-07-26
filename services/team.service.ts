import { apiClient } from "./api";
import { TeamMember } from "@/features/team/mock-data";

export const TeamService = {
  getMembers: async (orgId: string): Promise<TeamMember[]> => {
    const response = await apiClient.get(`/organizations/${orgId}/members`);
    return response.data || [];
  },
  inviteMember: async (orgId: string, email: string, role: string) => {
    const response = await apiClient.post(`/organizations/${orgId}/invite`, { email, role });
    return response.data;
  },
  updateRole: async (orgId: string, userId: string, role: string) => {
    const response = await apiClient.patch(`/organizations/${orgId}/members/${userId}/role`, { role });
    return response.data;
  },
  removeMember: async (orgId: string, userId: string) => {
    await apiClient.delete(`/organizations/${orgId}/members/${userId}`);
  }
};
