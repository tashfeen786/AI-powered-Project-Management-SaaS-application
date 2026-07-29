"use client";

import { SettingsData } from "@/types/api";

interface GeneralSettingsProps {
  settings: SettingsData;
  onChange: (updates: any) => void;
}

export function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background/50">
        <h2 className="text-base font-semibold text-text-primary">General</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Timezone</label>
            <select
              value={(settings as any).timezone || (settings as any).general?.timezone || "America/Los_Angeles"}
              onChange={(e) => onChange({ timezone: e.target.value })}
              className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Language</label>
            <select
              value={(settings as any).language || (settings as any).general?.language || "English (US)"}
              onChange={(e) => onChange({ language: e.target.value })}
              className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="English (US)">English (US)</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Date Format</label>
            <select
              value={(settings as any).dateFormat || (settings as any).general?.dateFormat || "MM/DD/YYYY"}
              onChange={(e) => onChange({ dateFormat: e.target.value })}
              className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Start of Week</label>
            <select
              value={(settings as any).startOfWeek || (settings as any).general?.startOfWeek || "Monday"}
              onChange={(e) => onChange({ startOfWeek: e.target.value })}
              className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
