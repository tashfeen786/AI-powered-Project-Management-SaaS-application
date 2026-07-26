import { useQuery } from "@tanstack/react-query";
import { PlanningService } from "@/services/planning.service";

export function usePlanningDraft(projectId: string) {
  return useQuery({
    queryKey: ["planningDraft", projectId],
    queryFn: () => PlanningService.getDraft(projectId),
    enabled: !!projectId,
  });
}
