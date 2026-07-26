"use client";

import { OrganizationSettings } from "@/features/settings/mock-data";

interface NotificationSettingsProps {
  settings: OrganizationSettings;
  onChange: (updates: Partial<OrganizationSettings>) => void;
}

export function NotificationSettings({ settings, onChange }: NotificationSettingsProps) {
  const toggles = [
    { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive daily updates and direct mentions via email.' },
    { id: 'browserNotifications', label: 'Browser Notifications', description: 'Show desktop notifications for important events.' },
    { id: 'aiJobNotifications', label: 'AI Job Notifications', description: 'Notify when background AI processing completes.' },
    { id: 'teamInvitationNotifications', label: 'Team Invitations', description: 'Notify when someone joins the organization.' },
    { id: 'weeklySummary', label: 'Weekly Summary', description: 'Receive a digest of project activities every Monday.' },
  ] as const;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background/50">
        <h2 className="text-base font-semibold text-text-primary">Notifications</h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-6">
          {toggles.map((toggle) => {
            const isChecked = settings[toggle.id as keyof OrganizationSettings] as boolean;
            return (
              <div key={toggle.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-text-primary">{toggle.label}</div>
                  <div className="text-xs text-text-secondary">{toggle.description}</div>
                </div>
                <button 
                  onClick={() => onChange({ [toggle.id]: !isChecked })}
                  className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${isChecked ? 'bg-primary' : 'bg-[#E5E5E5]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${isChecked ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
