import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RequirementsService } from "@/services/requirements.service";
import { RequirementCreate, RequirementUpdate, GenerateRequirementRequest, RequirementQueryParams } from "@/types/api";

export function useRequirements(projectId: string, params?: RequirementQueryParams) {
  return useQuery({
    queryKey: ["requirements", projectId, params],
    queryFn: () => RequirementsService.getRequirements(projectId, params),
    enabled: !!projectId,
  });
}

export function useCreateRequirement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RequirementCreate) => RequirementsService.createRequirement(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requirements", variables.project_id] });
    },
  });
}

export function useUpdateRequirement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, projectId }: { id: string, data: RequirementUpdate, projectId: string }) => 
      RequirementsService.updateRequirement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requirements", variables.projectId] });
    },
  });
}

export function useDeleteRequirement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string, projectId: string }) => 
      RequirementsService.deleteRequirement(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requirements", variables.projectId] });
    },
  });
}

export function useGenerateRequirement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string, data: GenerateRequirementRequest }) => 
      RequirementsService.generateRequirement(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requirements", variables.projectId] });
    },
  });
}
