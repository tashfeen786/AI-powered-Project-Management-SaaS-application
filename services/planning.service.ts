import { mockPlanningConversation, mockPlanningDraft, Message, PlanningData } from "@/features/planning/mock-data";

export const PlanningService = {
  sendMessage: async (projectId: string, content: string): Promise<Message> => {
    return new Promise(resolve => setTimeout(() => resolve({
      id: Math.random().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }), 500));
  },
  getDraft: async (projectId: string): Promise<PlanningData> => {
    return new Promise(resolve => setTimeout(() => resolve(mockPlanningDraft), 500));
  },
  updateDraft: async (projectId: string, payload: any): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 500));
  },
  approvePlan: async (projectId: string): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 2000));
  },
  getConversation: async (projectId: string): Promise<Message[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockPlanningConversation), 500));
  }
};
