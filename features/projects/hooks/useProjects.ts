import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";
import { ProjectQueryParams } from "@/types/api";

export function useProjects(params?: ProjectQueryParams) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => ProjectService.getProjects(params),
  });
}
