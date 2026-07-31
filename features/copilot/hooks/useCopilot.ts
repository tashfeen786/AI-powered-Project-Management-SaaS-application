import { useQuery } from "@tanstack/react-query";
import { CopilotService } from "@/services/copilot.service";

export function useCopilot(projectId?: string, agentId: string = "copilot") {
  return useQuery({
    queryKey: ["copilotConversations", projectId, agentId],
    queryFn: () => CopilotService.getConversations(projectId, agentId),
  });
}
