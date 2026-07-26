export type MessageRole = 'user' | 'ai';
export type AiStatus = 'Thinking' | 'Updating Draft' | 'Ready' | 'Generating Final Version';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
  estimatedHours: number;
  assignee: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  isLocked: boolean;
}

export interface SprintData {
  id: string;
  title: string;
  tasks: TaskData[];
  isLocked: boolean;
}

export interface MilestoneData {
  id: string;
  title: string;
  sprints: SprintData[];
  isLocked: boolean;
}

export interface EstimationData {
  totalStoryPoints: number;
  totalTasks: number;
  estimatedHours: number;
  projectedDuration: string;
}

export interface TeamRecommendation {
  developers: number;
  qa: number;
  designers: number;
  estimatedDuration: string;
}

export interface PlanningData {
  projectId: string;
  aiStatus: AiStatus;
  confidence: ConfidenceLevel;
  lastSaved: string;
  milestones: MilestoneData[];
  risks: string[];
  estimations: EstimationData;
  team: TeamRecommendation;
}

export const mockPlanningConversation: Message[] = [
  { id: '1', role: 'ai', content: 'I have analyzed the approved SRS. I suggest generating a 3 sprint roadmap starting with the Core Platform milestone. Shall I proceed?', timestamp: '10:00 AM' },
  { id: '2', role: 'user', content: 'Yes, but split authentication into separate tasks across Sprint 1.', timestamp: '10:02 AM' },
  { id: '3', role: 'ai', content: 'Done. I have broken down JWT Login and Organization Management into separate tasks under Sprint 1.', timestamp: '10:03 AM' },
];

export const mockPlanningDraft: PlanningData = {
  projectId: '1',
  aiStatus: 'Ready',
  confidence: 'High',
  lastSaved: 'Just now',
  risks: [
    'Authentication depends on Organization setup.',
    'Document parsing blocks Sprint 2.',
    'Backend API required before Kanban.'
  ],
  estimations: {
    totalStoryPoints: 45,
    totalTasks: 12,
    estimatedHours: 240,
    projectedDuration: '8 Weeks'
  },
  team: {
    developers: 5,
    qa: 1,
    designers: 1,
    estimatedDuration: '8 Weeks'
  },
  milestones: [
    {
      id: 'm1',
      title: 'Core Platform',
      isLocked: false,
      sprints: [
        {
          id: 's1',
          title: 'Sprint 1',
          isLocked: false,
          tasks: [
            {
              id: 't1',
              title: 'JWT Login',
              description: 'Implement JWT-based authentication using FastAPI.',
              priority: 'High',
              storyPoints: 5,
              estimatedHours: 24,
              assignee: 'Backend Dev',
              status: 'Todo',
              isLocked: true
            },
            {
              id: 't2',
              title: 'Organization Management',
              description: 'Create organization CRUD endpoints and RBAC.',
              priority: 'High',
              storyPoints: 8,
              estimatedHours: 40,
              assignee: 'Backend Dev',
              status: 'Todo',
              isLocked: false
            }
          ]
        },
        {
          id: 's2',
          title: 'Sprint 2',
          isLocked: false,
          tasks: [
            {
              id: 't3',
              title: 'Requirements AI Integration',
              description: 'Connect frontend DraftPanel with LLM endpoints.',
              priority: 'High',
              storyPoints: 13,
              estimatedHours: 60,
              assignee: 'AI Engineer',
              status: 'Todo',
              isLocked: false
            }
          ]
        }
      ]
    }
  ]
};
