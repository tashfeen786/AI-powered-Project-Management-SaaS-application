import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/services/document.service";
import { ProjectDocument } from "@/features/documents/mock-data";

export function useUploadDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => DocumentService.uploadDocument(projectId, file),
    onSuccess: (newDoc) => {
      queryClient.setQueryData<ProjectDocument[]>(["documents", projectId], (old = []) => [
        newDoc,
        ...old,
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    },
  });
}
