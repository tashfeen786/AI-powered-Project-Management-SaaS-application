import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/services/document.service";
import { DocumentResponse, PaginatedData } from "@/types/api";

export function useDeleteDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => DocumentService.deleteDocument(documentId),
    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: ["documents", projectId] });
      const previousData = queryClient.getQueryData<PaginatedData<DocumentResponse>>(["documents", projectId]);
      
      if (previousData) {
        queryClient.setQueryData<PaginatedData<DocumentResponse>>(
          ["documents", projectId],
          {
            ...previousData,
            items: previousData.items.filter(d => d.id !== documentId),
            total: previousData.total - 1,
          }
        );
      }
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["documents", projectId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    },
  });
}
