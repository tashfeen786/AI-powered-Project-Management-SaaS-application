import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => ProjectService.getProjects(),
  });
}
