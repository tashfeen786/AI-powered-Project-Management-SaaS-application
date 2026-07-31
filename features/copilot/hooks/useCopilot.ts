import { useQuery } from "@tanstack/react-query";
import { CopilotService } from "@/services/copilot.service";

export function useCopilot(projectId?: string) {
  return useQuery({
    queryKey: ["copilotConversations", projectId],
    queryFn: () => CopilotService.getConversations(projectId),
  });
}
