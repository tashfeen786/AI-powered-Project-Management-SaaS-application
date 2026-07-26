import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
  });
}
