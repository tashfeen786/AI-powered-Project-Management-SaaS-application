import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CopilotService } from "@/services/copilot.service";
import { CopilotMessage } from "@/features/copilot/mock-data";

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: ["copilotConversation", id],
    queryFn: () => id ? CopilotService.getConversation(id) : Promise.resolve([]),
    enabled: !!id,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) => 
      CopilotService.sendMessage(conversationId, content),
    onSuccess: (newMessage, { conversationId }) => {
      queryClient.setQueryData<CopilotMessage[]>(
        ["copilotConversation", conversationId], 
        (old = []) => [...old, newMessage]
      );
    }
  });
}
