import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";

export function useEnterpriseAnalytics() {
  return useQuery({
    queryKey: ["enterpriseAnalytics"],
    queryFn: async () => {
      const response = await apiClient.get("/analytics");
      return response.data;
    },
    refetchInterval: 10000, // Real-time refresh every 10 seconds
  });
}
