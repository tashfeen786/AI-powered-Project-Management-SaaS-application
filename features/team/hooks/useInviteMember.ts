import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "@/services/team.service";
import { TeamMember, TeamRole } from "@/features/team/mock-data";

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: TeamRole }) => TeamService.inviteMember(email, role),
    onSuccess: (newMember) => {
      queryClient.setQueryData<TeamMember[]>(["teamMembers"], (old = []) => [
        ...old,
        newMember
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
}
