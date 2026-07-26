import { useQuery } from "@tanstack/react-query";
import { ActivityService } from "@/services/activity.service";

export function useActivity(projectId: string) {
  return useQuery({
    queryKey: ["activity", projectId],
    queryFn: () => ActivityService.getActivity(projectId),
    enabled: !!projectId,
  });
}
