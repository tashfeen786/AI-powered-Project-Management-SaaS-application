import { mockSettings, OrganizationSettings } from "@/features/settings/mock-data";

let currentSettings = { ...mockSettings };

export const SettingsService = {
  getSettings: async (): Promise<OrganizationSettings> => {
    // API Contract: GET /api/v1/settings
    return new Promise(resolve => setTimeout(() => resolve({ ...currentSettings }), 800));
  },
  
  updateSettings: async (updates: Partial<OrganizationSettings>): Promise<OrganizationSettings> => {
    // API Contract: PATCH /api/v1/settings
    return new Promise((resolve) => setTimeout(() => {
      currentSettings = { ...currentSettings, ...updates };
      resolve({ ...currentSettings });
    }, 600));
  }
};
