import { mockConversations, mockMessages, CopilotConversation, CopilotMessage } from "@/features/copilot/mock-data";

export const CopilotService = {
  getConversations: async (): Promise<CopilotConversation[]> => {
    // API Contract: GET /api/v1/copilot/conversations
    return new Promise(resolve => setTimeout(() => resolve([...mockConversations]), 600));
  },
  
  getConversation: async (id: string): Promise<CopilotMessage[]> => {
    // API Contract: GET /api/v1/copilot/{id}
    return new Promise(resolve => setTimeout(() => resolve(mockMessages[id] || []), 500));
  },

  sendMessage: async (conversationId: string, content: string): Promise<CopilotMessage> => {
    // API Contract: POST /api/v1/copilot/message
    return new Promise(resolve => setTimeout(() => {
      resolve({
        id: Math.random().toString(),
        role: 'ai',
        content: `I received your message: "${content}". I am analyzing the workspace now...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1500)); // Simulate thinking time
  }
};
