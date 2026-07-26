import { useMutation } from "@tanstack/react-query";
import { RequirementsService } from "@/services/requirements.service";

export function useApproveDraft() {
  return useMutation({
    mutationFn: (projectId: string) => RequirementsService.approveDraft(projectId),
  });
}
