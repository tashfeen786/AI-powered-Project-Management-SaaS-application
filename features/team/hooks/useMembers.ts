import { useQuery } from "@tanstack/react-query";
import { TeamService } from "@/services/team.service";

export function useMembers() {
  return useQuery({
    queryKey: ["teamMembers"],
    queryFn: () => TeamService.getMembers(),
  });
}
