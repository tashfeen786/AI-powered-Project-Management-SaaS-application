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

export const mockDataRemoved = [];

export const mockDataRemoved = {};
