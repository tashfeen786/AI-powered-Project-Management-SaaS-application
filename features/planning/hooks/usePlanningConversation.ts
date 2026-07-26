import { useQuery } from "@tanstack/react-query";
import { PlanningService } from "@/services/planning.service";

export function usePlanningConversation(projectId: string) {
  return useQuery({
    queryKey: ["planningConversation", projectId],
    queryFn: () => PlanningService.getConversation(projectId),
    enabled: !!projectId,
  });
}
