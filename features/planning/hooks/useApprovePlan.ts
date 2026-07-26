import { useMutation } from "@tanstack/react-query";
import { PlanningService } from "@/services/planning.service";

export function useApprovePlan() {
  return useMutation({
    mutationFn: (projectId: string) => PlanningService.approvePlan(projectId),
  });
}
