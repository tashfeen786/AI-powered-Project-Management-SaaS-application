export interface OrganizationSettings {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  timezone: string;
  language: string;
  dateFormat: string;
  workingDays: string[];
  startOfWeek: string;
  theme: 'System' | 'Light' | 'Dark';
  compactMode: boolean;
  emailNotifications: boolean;
  browserNotifications: boolean;
  aiJobNotifications: boolean;
  teamInvitationNotifications: boolean;
  weeklySummary: boolean;
  aiProvider: string;
  aiModel: string;
  autoSaveDraft: boolean;
  autoGenerateSuggestions: boolean;
  aiConfidenceThreshold: number;
}

export const mockDataRemoved = {};

export const mockDataRemoved = {};
