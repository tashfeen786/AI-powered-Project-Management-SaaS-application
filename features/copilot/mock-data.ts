export interface CopilotConversation {
  id: string;
  title: string;
  updatedAt: string;
  isPinned: boolean;
}

export interface CopilotSource {
  id: string;
  title: string;
  type: 'project' | 'sprint' | 'requirements' | 'document' | 'meeting';
}

export interface CopilotAction {
  id: string;
  label: string;
  type: string;
}

export interface CopilotAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  sources?: CopilotSource[];
  actions?: CopilotAction[];
  attachments?: CopilotAttachment[];
}

export const mockDataRemoved = [];

export const mockMessages: Record<string, CopilotMessage[]> = {
  'c1': [
    {
      id: 'm1',
      role: 'user',
      content: 'Summarize the current status of Project Alpha. Are there any delays?',
      timestamp: '10:00 AM'
    },
    {
      id: 'm2',
      role: 'ai',
      content: 'Based on the latest data from the Project Alpha workspace, the project is currently in the **Development Phase**. \n\nThere is a slight risk of a 2-day delay due to a bottleneck in the backend API integrations (Tasks #142 and #145 are blocked). Sprint velocity has dropped by 5% this week.\n\nI recommend reallocating resources or splitting Task #142 to accelerate delivery.',
      timestamp: '10:01 AM',
      sources: [
        { id: 's1', title: 'Project Alpha', type: 'project' },
        { id: 's2', title: 'Sprint 12 Board', type: 'sprint' }
      ],
      actions: [
        { id: 'a1', label: 'Generate Mitigation Plan', type: 'Generate Tasks' },
        { id: 'a2', label: 'Split Task #142', type: 'Generate Tasks' }
      ]
    }
  ]
};
