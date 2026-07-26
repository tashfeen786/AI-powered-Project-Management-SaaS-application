import { useQuery } from "@tanstack/react-query";
import { DocumentService } from "@/services/document.service";

export function useDocuments(projectId: string) {
  return useQuery({
    queryKey: ["documents", projectId],
    queryFn: () => DocumentService.getDocuments(projectId),
    enabled: !!projectId,
  });
}
