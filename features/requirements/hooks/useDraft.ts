import { useQuery } from "@tanstack/react-query";
import { RequirementsService } from "@/services/requirements.service";

export function useDraft(projectId: string) {
  return useQuery({
    queryKey: ["draft", projectId],
    queryFn: () => RequirementsService.getDraft(projectId),
    enabled: !!projectId,
  });
}
