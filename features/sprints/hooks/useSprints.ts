import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SprintsService, SprintQueryParams } from "@/services/sprints.service";
import { SprintCreate, SprintUpdate, GenerateSprintPlanRequest } from "@/types/api";

export function useSprints(projectId: string, params?: SprintQueryParams) {
  return useQuery({
    queryKey: ["sprints", projectId, params],
    queryFn: () => SprintsService.getSprints(projectId, params),
    enabled: !!projectId,
  });
}

export function useSprint(sprintId: string) {
  return useQuery({
    queryKey: ["sprints", "detail", sprintId],
    queryFn: () => SprintsService.getSprint(sprintId),
    enabled: !!sprintId,
  });
}

export function useCreateSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SprintCreate) => SprintsService.createSprint(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", variables.project_id] });
    },
  });
}

export function useUpdateSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, projectId }: { id: string, data: SprintUpdate, projectId: string }) => 
      SprintsService.updateSprint(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["sprints", "detail", variables.id] });
    },
  });
}

export function useDeleteSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string, projectId: string }) => 
      SprintsService.deleteSprint(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", variables.projectId] });
    },
  });
}

export function useGenerateSprintPlan() {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string, data: GenerateSprintPlanRequest }) => 
      SprintsService.generateSprintPlan(projectId, data),
  });
}
