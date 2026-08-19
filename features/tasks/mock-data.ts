export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Activity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  storyPoints: number;
  estimatedHours: number;
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  sprint: string;
  comments: Comment[];
  activity: Activity[];
}


