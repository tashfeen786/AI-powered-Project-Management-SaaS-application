import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => ProjectService.getProject(id),
    enabled: !!id,
  });
}
