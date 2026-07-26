import { useQuery } from "@tanstack/react-query";
import { CopilotService } from "@/services/copilot.service";

export function useCopilot() {
  return useQuery({
    queryKey: ["copilotConversations"],
    queryFn: () => CopilotService.getConversations(),
  });
}
