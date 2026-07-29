import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CopilotService } from "@/services/copilot.service";
import { MessageResponse, ConversationDetailResponse } from "@/types/api";

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: ["copilotConversation", id],
    queryFn: async () => {
      if (!id) return null;
      const detail: ConversationDetailResponse = await CopilotService.getConversation(id);
      return detail.messages ?? [];
    },
    enabled: !!id,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) => 
      CopilotService.sendMessage(conversationId, content),
    onSuccess: (newMessage, { conversationId }) => {
      queryClient.setQueryData<MessageResponse[]>(
        ["copilotConversation", conversationId], 
        (old = []) => [...old, newMessage]
      );
      // Also refresh conversation list (updated_at changes)
      queryClient.invalidateQueries({ queryKey: ["copilotConversations"] });
    }
  });
}
