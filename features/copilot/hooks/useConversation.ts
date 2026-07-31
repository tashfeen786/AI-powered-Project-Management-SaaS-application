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
    mutationFn: async ({ conversationId, content, projectId }: { conversationId: string; content: string; projectId?: string }) => {
      // Optimistically add user message
      const userMessage = {
        id: "temp-" + Date.now(),
        conversation_id: conversationId,
        role: "user",
        content,
        created_at: new Date().toISOString()
      };
      queryClient.setQueryData<MessageResponse[]>(
        ["copilotConversation", conversationId], 
        (old = []) => [...old, userMessage as any]
      );

      // Create placeholder AI message
      const aiMessageId = "temp-ai-" + Date.now();
      let aiContent = "";
      
      queryClient.setQueryData<MessageResponse[]>(
        ["copilotConversation", conversationId], 
        (old = []) => [...old, {
          id: aiMessageId,
          conversation_id: conversationId,
          role: "assistant",
          content: "",
          created_at: new Date().toISOString()
        } as any]
      );

      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"}/copilot/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ conversation_id: conversationId, content })
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (!dataStr) continue;
              try {
                const data = JSON.parse(dataStr);
                if (data.content) {
                  aiContent += data.content;
                  // Update the placeholder AI message with appended content
                  queryClient.setQueryData<MessageResponse[]>(
                    ["copilotConversation", conversationId], 
                    (old = []) => old.map(m => m.id === aiMessageId ? { ...m, content: aiContent } : m)
                  );
                }
                if (data.done && data.message) {
                  // Replace placeholder with final message
                  queryClient.setQueryData<MessageResponse[]>(
                    ["copilotConversation", conversationId], 
                    (old = []) => old.map(m => m.id === aiMessageId ? data.message : m)
                  );
                  return data.message;
                }
              } catch (e) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      }
      return null;
    },
    onSuccess: (newMessage, { conversationId, projectId }) => {
      // Also refresh conversation list (updated_at changes)
      queryClient.invalidateQueries({ queryKey: ["copilotConversations", projectId] });
    }
  });
}
