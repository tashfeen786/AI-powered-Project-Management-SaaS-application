import { apiClient } from "./api";
import {
  ConversationResponse,
  ConversationDetailResponse,
  MessageResponse,
  StandardResponse,
} from "@/types/api";

export const CopilotService = {
  createConversation: async (projectId?: string): Promise<ConversationResponse> => {
    const response: StandardResponse<ConversationResponse> = await apiClient.post("/copilot/conversations", {
      project_id: projectId || null,
    });
    return response.data!;
  },

  getConversations: async (projectId?: string): Promise<ConversationResponse[]> => {
    const params = projectId ? { project_id: projectId } : undefined;
    const response: StandardResponse<ConversationResponse[]> = await apiClient.get("/copilot/conversations", params);
    return response.data ?? [];
  },

  getConversation: async (conversationId: string): Promise<ConversationDetailResponse> => {
    const response: StandardResponse<ConversationDetailResponse> = await apiClient.get(
      `/copilot/conversations/${conversationId}`
    );
    return response.data!;
  },

  // Alias for backward compat
  getConversationDetails: async (conversationId: string): Promise<ConversationDetailResponse> => {
    return CopilotService.getConversation(conversationId);
  },

  sendMessage: async (conversationId: string, content: string): Promise<MessageResponse> => {
    const response: StandardResponse<MessageResponse> = await apiClient.post("/copilot/chat", {
      conversation_id: conversationId,
      content,
    });
    return response.data!;
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/copilot/conversations/${conversationId}`);
  },

  renameConversation: async (conversationId: string, title: string): Promise<ConversationResponse> => {
    const response: StandardResponse<ConversationResponse> = await apiClient.patch(`/copilot/conversations/${conversationId}`, { title });
    return response.data!;
  },
};
