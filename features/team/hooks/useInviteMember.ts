import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "@/services/team.service";
import { TeamMemberResponse } from "@/types/api";

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) => TeamService.inviteMember(email, role),
    onSuccess: (newMember) => {
      queryClient.setQueryData<TeamMemberResponse[]>(["teamMembers"], (old = []) => [
        ...old,
        newMember
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
}
