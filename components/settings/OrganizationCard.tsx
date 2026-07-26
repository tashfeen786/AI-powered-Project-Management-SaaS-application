"use client";

import { OrganizationSettings } from "@/features/settings/mock-data";
import { Upload } from "lucide-react";

interface OrganizationCardProps {
  settings: OrganizationSettings;
  onChange: (updates: Partial<OrganizationSettings>) => void;
}

export function OrganizationCard({ settings, onChange }: OrganizationCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background/50">
        <h2 className="text-base font-semibold text-text-primary">Organization Profile</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary shrink-0 overflow-hidden relative group cursor-pointer">
            <span className="text-2xl font-bold">{settings.name.charAt(0)}</span>
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-5 h-5 text-white mb-1" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-primary mb-1.5">Organization Name</label>
            <input 
              type="text" 
              value={settings.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full max-w-md h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Industry</label>
            <input 
              type="text" 
              value={settings.industry}
              onChange={(e) => onChange({ industry: e.target.value })}
              className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Website</label>
            <input 
              type="url" 
              value={settings.website}
              onChange={(e) => onChange({ website: e.target.value })}
              className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Description</label>
          <textarea 
            value={settings.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
            className="w-full p-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Organization ID</label>
          <input 
            type="text" 
            value={settings.id}
            readOnly
            className="w-full max-w-sm h-9 px-3 bg-background/50 border border-border rounded-md text-sm text-text-secondary cursor-not-allowed font-mono"
          />
        </div>
      </div>
    </div>
  );
}
