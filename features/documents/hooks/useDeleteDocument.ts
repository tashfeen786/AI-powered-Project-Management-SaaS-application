import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/services/document.service";
import { ProjectDocument } from "@/features/documents/mock-data";

export function useDeleteDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => DocumentService.deleteDocument(documentId),
    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: ["documents", projectId] });
      const previousDocs = queryClient.getQueryData<ProjectDocument[]>(["documents", projectId]);
      
      if (previousDocs) {
        queryClient.setQueryData<ProjectDocument[]>(
          ["documents", projectId],
          previousDocs.filter(d => d.id !== documentId)
        );
      }
      return { previousDocs };
    },
    onError: (err, variables, context) => {
      if (context?.previousDocs) {
        queryClient.setQueryData(["documents", projectId], context.previousDocs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    },
  });
}
