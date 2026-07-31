import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/services/document.service";
import { DocumentResponse, PaginatedData } from "@/types/api";

interface UploadArgs {
  file: File;
  folderPath: string;
}

export function useUploadDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, folderPath }: UploadArgs) => DocumentService.uploadDocument(projectId, file, folderPath),
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    }
  });
}
