import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "@/services/task.service";
import { TaskStatus, TaskResponse, PaginatedData } from "@/types/api";

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) => 
      TaskService.updateTaskStatus(taskId, status),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const previousData = queryClient.getQueryData<PaginatedData<TaskResponse>>(["tasks", projectId]);
      
      if (previousData) {
        queryClient.setQueryData<PaginatedData<TaskResponse>>(
          ["tasks", projectId],
          {
            ...previousData,
            items: previousData.items.map(t => t.id === taskId ? { ...t, status } : t),
          }
        );
      }
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["tasks", projectId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
