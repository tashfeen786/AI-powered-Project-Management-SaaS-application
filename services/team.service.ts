import { mockMembers, TeamMember, TeamRole } from "@/features/team/mock-data";

let currentMembers = [...mockMembers];

export const TeamService = {
  getMembers: async (): Promise<TeamMember[]> => {
    // API Contract: GET /api/v1/team
    return new Promise(resolve => setTimeout(() => resolve([...currentMembers]), 600));
  },
  
  inviteMember: async (email: string, role: TeamRole): Promise<TeamMember> => {
    // API Contract: POST /api/v1/team/invite
    return new Promise(resolve => setTimeout(() => {
      const newMember: TeamMember = {
        id: Math.random().toString(),
        name: email.split('@')[0],
        email,
        avatar: email.substring(0, 2).toUpperCase(),
        role,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastActive: "Never",
        status: "Pending"
      };
      currentMembers = [...currentMembers, newMember];
      resolve(newMember);
    }, 800));
  },
  
  updateRole: async (id: string, newRole: TeamRole): Promise<TeamMember> => {
    // API Contract: PATCH /api/v1/team/{id}
    return new Promise((resolve, reject) => setTimeout(() => {
      const idx = currentMembers.findIndex(m => m.id === id);
      if (idx > -1) {
        currentMembers[idx] = { ...currentMembers[idx], role: newRole };
        resolve(currentMembers[idx]);
      } else {
        reject(new Error("Not found"));
      }
    }, 400));
  },
  
  deleteMember: async (id: string): Promise<void> => {
    // API Contract: DELETE /api/v1/team/{id}
    return new Promise((resolve) => setTimeout(() => {
      currentMembers = currentMembers.filter(m => m.id !== id);
      resolve();
    }, 500));
  }
};
