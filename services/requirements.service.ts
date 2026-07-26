import { mockConversation, mockDraft, Message, SRSData } from "@/features/requirements/mock-data";

export const RequirementsService = {
  sendMessage: async (projectId: string, content: string): Promise<Message> => {
    return new Promise(resolve => setTimeout(() => resolve({
      id: Math.random().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }), 500));
  },
  getDraft: async (projectId: string): Promise<SRSData> => {
    return new Promise(resolve => setTimeout(() => resolve(mockDraft), 500));
  },
  updateDraft: async (projectId: string, sectionId: string, content: string): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 500));
  },
  approveDraft: async (projectId: string): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 2000));
  },
  getConversation: async (projectId: string): Promise<Message[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockConversation), 500));
  }
};
