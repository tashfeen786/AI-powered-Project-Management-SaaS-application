import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlanningService } from "@/services/planning.service";

export function useApprovePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => PlanningService.approvePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planningDraft"] });
      queryClient.invalidateQueries({ queryKey: ["planningConversation"] });
    },
  });
}
