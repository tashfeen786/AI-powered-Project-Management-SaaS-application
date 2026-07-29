import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [stats, recentProjects] = await Promise.all([
        ProjectService.getStatistics(),
        ProjectService.getRecentProjects(6),
      ]);
      return { stats, recentProjects };
    },
  });
}
