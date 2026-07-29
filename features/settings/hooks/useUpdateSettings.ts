import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: any) => SettingsService.updateSettings(updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["settings"] });
      const previousSettings = queryClient.getQueryData<any>(["settings"]);
      
      if (previousSettings) {
        queryClient.setQueryData<any>(
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
