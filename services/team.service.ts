import { apiClient } from "./api";
import { TeamMemberResponse, StandardResponse } from "@/types/api";

/**
 * Team service — Backend uses /team prefix (derived from current_organization_id on the user).
 * No orgId parameter needed — the backend resolves it from the JWT token.
 */
export const TeamService = {
  getMembers: async (): Promise<TeamMemberResponse[]> => {
    const response: StandardResponse<TeamMemberResponse[]> = await apiClient.get("/team");
    return response.data ?? [];
  },

  getMember: async (memberId: string): Promise<TeamMemberResponse> => {
    const response: StandardResponse<TeamMemberResponse> = await apiClient.get(`/team/${memberId}`);
    return response.data!;
  },

  inviteMember: async (email: string, role: string): Promise<TeamMemberResponse> => {
    const response: StandardResponse<TeamMemberResponse> = await apiClient.post("/team/invite", { email, role });
    return response.data!;
  },

  updateRole: async (memberId: string, role: string): Promise<TeamMemberResponse> => {
    const response: StandardResponse<TeamMemberResponse> = await apiClient.patch(`/team/${memberId}`, { role });
    return response.data!;
  },

  removeMember: async (memberId: string): Promise<void> => {
    await apiClient.delete(`/team/${memberId}`);
  },

  resendInvite: async (memberId: string): Promise<void> => {
    await apiClient.post(`/team/${memberId}/resend-invite`, {});
  },

  // Alias for hooks that call deleteMember
  deleteMember: async (memberId: string): Promise<void> => {
    await TeamService.removeMember(memberId);
  },
};
