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

export const mockMembers: TeamMember[] = [
  {
    id: "u1",
    name: "Alex Developer",
    email: "alex@company.com",
    avatar: "AD",
    role: "Developer",
    joinedDate: "Jan 12, 2026",
    lastActive: "Just now",
    status: "Active"
  },
  {
    id: "u2",
    name: "Sarah PM",
    email: "sarah@company.com",
    avatar: "SP",
    role: "Project Manager",
    joinedDate: "Feb 05, 2026",
    lastActive: "1 hour ago",
    status: "Active"
  },
  {
    id: "u3",
    name: "Michael Owner",
    email: "michael@company.com",
    avatar: "MO",
    role: "Owner",
    joinedDate: "Jan 01, 2026",
    lastActive: "Yesterday",
    status: "Active"
  },
  {
    id: "u4",
    name: "Jessica Design",
    email: "jessica@company.com",
    avatar: "JD",
    role: "Designer",
    joinedDate: "Mar 15, 2026",
    lastActive: "2 days ago",
    status: "Active"
  },
  {
    id: "u5",
    name: "Tom Quality",
    email: "tom@company.com",
    avatar: "TQ",
    role: "QA",
    joinedDate: "Apr 20, 2026",
    lastActive: "Never",
    status: "Pending"
  }
];
