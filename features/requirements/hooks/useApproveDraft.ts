import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RequirementsService } from "@/services/requirements.service";

export function useApproveDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => RequirementsService.approveDraft(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["draft", projectId] });
      queryClient.invalidateQueries({ queryKey: ["requirements", projectId] });
    },
  });
}
