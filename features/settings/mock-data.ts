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

export const mockSettings: OrganizationSettings = {
  id: "org_9f8e7d6c5b4a3",
  name: "Acme Corporation",
  description: "Building the future of artificial intelligence SaaS platforms.",
  industry: "Technology",
  website: "https://acme.example.com",
  timezone: "America/Los_Angeles",
  language: "English (US)",
  dateFormat: "MM/DD/YYYY",
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  startOfWeek: "Monday",
  theme: "System",
  compactMode: false,
  emailNotifications: true,
  browserNotifications: true,
  aiJobNotifications: true,
  teamInvitationNotifications: true,
  weeklySummary: false,
  aiProvider: "OpenAI",
  aiModel: "gpt-4o",
  autoSaveDraft: true,
  autoGenerateSuggestions: true,
  aiConfidenceThreshold: 80,
};

export const mockBillingInfo = {
  plan: "Pro Tier",
  members: 14,
  projects: 8,
  storageUsed: "45 GB / 100 GB",
  apiUsage: "450k / 1M tokens",
};
