import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/services/document.service";
import { DocumentResponse, PaginatedData } from "@/types/api";

export function useUploadDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => DocumentService.uploadDocument(projectId, file),
    onSuccess: (newDoc) => {
      // Optimistically add to the paginated cache
      queryClient.setQueryData<PaginatedData<DocumentResponse>>(
        ["documents", projectId],
        (old) => {
          if (!old) return { items: [newDoc], total: 1, page: 1, limit: 20 };
          return { ...old, items: [newDoc, ...old.items], total: old.total + 1 };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    },
  });
}
