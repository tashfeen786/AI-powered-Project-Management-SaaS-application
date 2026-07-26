import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "@/services/team.service";
import { TeamMember } from "@/features/team/mock-data";

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TeamService.deleteMember(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["teamMembers"] });
      const previousMembers = queryClient.getQueryData<TeamMember[]>(["teamMembers"]);
      
      if (previousMembers) {
        queryClient.setQueryData<TeamMember[]>(
          ["teamMembers"],
          previousMembers.filter(m => m.id !== id)
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
