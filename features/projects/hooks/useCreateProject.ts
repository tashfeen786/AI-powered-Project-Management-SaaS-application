import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";
import { ProjectCreate } from "@/types/api";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectCreate) => ProjectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
