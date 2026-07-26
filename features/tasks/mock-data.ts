export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';

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

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Implement JWT Login',
    description: 'Set up JWT authentication flow with FastAPI and React Query.',
    priority: 'High',
    status: 'In Progress',
    storyPoints: 5,
    estimatedHours: 24,
    assignee: 'Alex Dev',
    assigneeAvatar: 'AD',
    dueDate: 'Oct 25',
    sprint: 'Sprint 1',
    comments: [
      { id: 'c1', user: 'Sarah PM', avatar: 'SP', text: 'Make sure to add refresh tokens.', timestamp: '2 hours ago' }
    ],
    activity: [
      { id: 'a1', action: 'moved task to In Progress', user: 'Alex Dev', timestamp: '1 hour ago' }
    ]
  },
  {
    id: 't2',
    title: 'Organization Management',
    description: 'CRUD endpoints for organizations.',
    priority: 'Medium',
    status: 'To Do',
    storyPoints: 8,
    estimatedHours: 40,
    assignee: 'John Smith',
    assigneeAvatar: 'JS',
    dueDate: 'Oct 28',
    sprint: 'Sprint 1',
    comments: [],
    activity: [
      { id: 'a2', action: 'created task', user: 'System', timestamp: 'Yesterday' }
    ]
  },
  {
    id: 't3',
    title: 'Dashboard Skeleton',
    description: 'Create loading skeleton for the dashboard.',
    priority: 'Low',
    status: 'Review',
    storyPoints: 3,
    estimatedHours: 12,
    assignee: 'Mia Front',
    assigneeAvatar: 'MF',
    dueDate: 'Oct 24',
    sprint: 'Sprint 1',
    comments: [],
    activity: []
  },
  {
    id: 't4',
    title: 'Setup FastAPI Repo',
    description: 'Initialize the python backend with SQLAlchemy.',
    priority: 'High',
    status: 'Done',
    storyPoints: 5,
    estimatedHours: 16,
    assignee: 'Alex Dev',
    assigneeAvatar: 'AD',
    dueDate: 'Oct 20',
    sprint: 'Sprint 1',
    comments: [],
    activity: []
  },
];
