import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CollaborationService } from "@/services/collaboration.service";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => CollaborationService.getNotifications(),
    refetchInterval: 30000, // Poll occasionally, WS will do instant updates
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CollaborationService.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useToggleReaction(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, emoji }: { commentId: string; emoji: string }) => 
      CollaborationService.toggleReaction(commentId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useToggleWatcher(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => CollaborationService.toggleWatcher(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useUploadAttachment(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, file }: { taskId: string; file: File }) => 
      CollaborationService.uploadAttachment(taskId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
