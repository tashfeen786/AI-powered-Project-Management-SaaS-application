export type ProjectStatus = "Planning" | "Active" | "Review" | "Completed";

export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  members: string[];
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
  createdDate: string;
  lastUpdated: string;
  summary: string;
}

export const mockDataRemoved = [];
