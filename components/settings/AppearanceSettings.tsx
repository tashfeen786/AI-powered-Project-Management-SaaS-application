"use client";

import { SettingsData } from "@/types/api";
import { Monitor, Sun, Moon } from "lucide-react";

interface AppearanceSettingsProps {
  settings: SettingsData;
  onChange: (updates: any) => void;
}

export function AppearanceSettings({ settings, onChange }: AppearanceSettingsProps) {
  const themes = [
    { id: 'System', icon: Monitor },
    { id: 'Light', icon: Sun },
    { id: 'Dark', icon: Moon },
  ] as const;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background/50">
        <h2 className="text-base font-semibold text-text-primary">Appearance</h2>
      </div>
      <div className="p-6 space-y-8">
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">Theme Preference</label>
          <div className="flex gap-4">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isActive = ((settings as any).theme || (settings as any).appearance?.theme) === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onChange({ theme: theme.id })}
                  className={`flex flex-col items-center justify-center gap-2 w-24 h-20 rounded-lg border transition-colors ${isActive ? 'bg-primary/5 border-primary text-primary' : 'bg-background border-border text-text-secondary hover:border-text-secondary'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{theme.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">Accent Color (Read-only)</label>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary ring-2 ring-offset-2 ring-primary"></div>
            <div className="w-8 h-8 rounded-full bg-[#171717] opacity-50 cursor-not-allowed"></div>
            <div className="w-8 h-8 rounded-full bg-[#0070F3] opacity-50 cursor-not-allowed"></div>
            <div className="w-8 h-8 rounded-full bg-[#F5A623] opacity-50 cursor-not-allowed"></div>
            <div className="w-8 h-8 rounded-full bg-[#E00] opacity-50 cursor-not-allowed"></div>
          </div>
          <p className="text-xs text-text-secondary mt-2">Custom accent colors are available on Enterprise plans.</p>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border pt-6">
          <div>
            <div className="text-sm font-medium text-text-primary">Compact Mode</div>
            <div className="text-xs text-text-secondary">Reduce padding across all tables and lists.</div>
          </div>
          <button 
            onClick={() => onChange({ compactMode: !((settings as any).compactMode || (settings as any).appearance?.compactMode) })}
            className={`w-9 h-5 rounded-full transition-colors relative ${((settings as any).compactMode || (settings as any).appearance?.compactMode) ? 'bg-primary' : 'bg-[#E5E5E5]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${((settings as any).compactMode || (settings as any).appearance?.compactMode) ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
