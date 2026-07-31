import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/services/document.service";
import { DocumentUpdate } from "@/types/api";

interface UpdateDocArgs {
  documentId: string;
  updates: DocumentUpdate;
}

export function useUpdateDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, updates }: UpdateDocArgs) =>
      DocumentService.updateDocument(documentId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    },
  });
}
