import { useQuery } from "@tanstack/react-query";
import { DocumentService } from "@/services/document.service";

export function useDocuments(projectId: string, params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ["documents", projectId, params?.page, params?.limit, params?.search],
    queryFn: () => DocumentService.getDocuments(projectId, params),
    enabled: !!projectId,
  });
}
