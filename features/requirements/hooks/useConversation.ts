import { useQuery } from "@tanstack/react-query";
import { RequirementsService } from "@/services/requirements.service";

export function useConversation(projectId: string) {
  return useQuery({
    queryKey: ["conversation", projectId],
    queryFn: () => RequirementsService.getConversation(projectId),
    enabled: !!projectId,
  });
}
