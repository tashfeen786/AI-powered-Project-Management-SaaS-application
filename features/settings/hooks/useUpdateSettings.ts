import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";
import { OrganizationSettings } from "@/features/settings/mock-data";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<OrganizationSettings>) => SettingsService.updateSettings(updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["settings"] });
      const previousSettings = queryClient.getQueryData<OrganizationSettings>(["settings"]);
      
      if (previousSettings) {
        queryClient.setQueryData<OrganizationSettings>(
          ["settings"],
          { ...previousSettings, ...updates }
        );
      }
      return { previousSettings };
    },
    onError: (err, variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(["settings"], context.previousSettings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  });
}
