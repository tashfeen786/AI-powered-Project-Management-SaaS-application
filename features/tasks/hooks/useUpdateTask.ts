import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "@/services/task.service";
import { TaskUpdate, TaskResponse, PaginatedData } from "@/types/api";

interface UpdateTaskArgs extends TaskUpdate {
  taskId: string;
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, ...data }: UpdateTaskArgs) => 
      TaskService.updateTask(taskId, data),
    onMutate: async ({ taskId, ...data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const previousData = queryClient.getQueryData<PaginatedData<TaskResponse>>(["tasks", projectId]);
      
      if (previousData) {
        queryClient.setQueryData<PaginatedData<TaskResponse>>(
          ["tasks", projectId],
          {
            ...previousData,
            items: previousData.items.map(t => t.id === taskId ? { ...t, ...data } as TaskResponse : t),
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
