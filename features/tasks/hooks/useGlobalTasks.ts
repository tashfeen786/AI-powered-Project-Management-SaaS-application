import { useQuery } from "@tanstack/react-query";
import { TaskService } from "@/services/task.service";

export function useGlobalTasks() {
  return useQuery({
    queryKey: ["global_tasks"],
    queryFn: () => TaskService.getGlobalTasks(),
  });
}
