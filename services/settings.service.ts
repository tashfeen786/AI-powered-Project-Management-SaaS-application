import { apiClient } from "./api";
import { StandardResponse } from "@/types/api";

/**
 * Settings service — Backend route: /settings (no org prefix, derived from JWT)
 */
export const SettingsService = {
  getSettings: async (): Promise<any> => {
    const response: StandardResponse<any> = await apiClient.get("/settings");
    return response.data ?? {};
  },

  updateSettings: async (settings: any): Promise<any> => {
    const response: StandardResponse<any> = await apiClient.patch("/settings", settings);
    return response.data ?? {};
  },
};
