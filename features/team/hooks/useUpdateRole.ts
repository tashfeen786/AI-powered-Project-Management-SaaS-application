import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "@/services/team.service";
import { TeamMember, TeamRole } from "@/features/team/mock-data";

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: TeamRole }) => TeamService.updateRole(id, role),
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ["teamMembers"] });
      const previousMembers = queryClient.getQueryData<TeamMember[]>(["teamMembers"]);
      
      if (previousMembers) {
        queryClient.setQueryData<TeamMember[]>(
          ["teamMembers"],
          previousMembers.map(m => m.id === id ? { ...m, role } : m)
        );
      }
      return { previousMembers };
    },
    onError: (err, variables, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(["teamMembers"], context.previousMembers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    }
  });
}
