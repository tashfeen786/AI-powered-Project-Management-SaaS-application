export type ProjectStatus = "Planning" | "Active" | "Review" | "Completed";
export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Todo" | "In Progress" | "Review" | "Done";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  members: string[];
  lastUpdated: string;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface Activity {
  id: string;
  title: string;
  time: string;
}

export interface Notification {
  id: string;
  title: string;
  read: boolean;
  time: string;
}
