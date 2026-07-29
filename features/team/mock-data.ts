export type TeamRole = 'Owner' | 'Project Manager' | 'Developer' | 'Designer' | 'QA';
export type MemberStatus = 'Active' | 'Pending';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: TeamRole;
  joinedDate: string;
  lastActive: string;
  status: MemberStatus;
}


