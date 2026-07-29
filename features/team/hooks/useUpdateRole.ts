import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "@/services/team.service";
import { TeamMemberResponse } from "@/types/api";

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => TeamService.updateRole(id, role),
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ["teamMembers"] });
      const previousMembers = queryClient.getQueryData<TeamMemberResponse[]>(["teamMembers"]);
      
      if (previousMembers) {
        queryClient.setQueryData<TeamMemberResponse[]>(
          ["teamMembers"],
          previousMembers.map(m => m.id === id ? { ...m, role: role as any } : m)
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
