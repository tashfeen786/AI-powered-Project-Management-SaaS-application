import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityService } from "@/services/activity.service";

export function useGlobalActivity(filterType?: string) {
  return useInfiniteQuery({
    queryKey: ["global_activity", filterType],
    queryFn: ({ pageParam = 1 }) => 
      ActivityService.getGlobalActivity({ page: pageParam as number, limit: 20, filter_type: filterType }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.items) return undefined;
      const currentCount = (lastPage.page - 1) * lastPage.limit + lastPage.items.length;
      if (currentCount < lastPage.total) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
