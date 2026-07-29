import { apiClient } from "./api";
import { StandardResponse } from "@/types/api";

export const HealthService = {
  check: async (): Promise<any> => {
    const response = await apiClient.get("/health", undefined, { requireAuth: false });
    return response;
  },
};
