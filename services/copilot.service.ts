import { apiClient } from "./api";
import { Message } from "@/features/copilot/mock-data";

export const CopilotService = {
  createConversation: async (projectId?: string) => {
    const response = await apiClient.post("/copilot/conversations", { project_id: projectId });
    return response.data;
  },
  
  getConversations: async () => {
    const response = await apiClient.get("/copilot/conversations");
    return response.data || [];
  },

  getConversationDetails: async (conversationId: string) => {
    const response = await apiClient.get(`/copilot/conversations/${conversationId}`);
    return response.data;
  },
  
  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    const response = await apiClient.post(`/copilot/chat`, {
      conversation_id: conversationId,
      content
    });
    return response.data;
  },

  deleteConversation: async (conversationId: string) => {
    await apiClient.delete(`/copilot/conversations/${conversationId}`);
  }
};
