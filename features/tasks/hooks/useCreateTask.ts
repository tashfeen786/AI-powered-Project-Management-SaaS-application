import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "@/services/task.service";
import { TaskCreate } from "@/types/api";

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<TaskCreate, "project_id">) => 
      TaskService.createTask({ ...data, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
