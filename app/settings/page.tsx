"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { OrganizationCard } from "@/components/settings/OrganizationCard";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AISettings } from "@/components/settings/AISettings";
import { BillingCard } from "@/components/settings/BillingCard";
import { DangerZone } from "@/components/settings/DangerZone";
import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsSkeleton } from "@/components/settings/SettingsSkeleton";
import { OrganizationSettings } from "@/features/settings/mock-data";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useUpdateSettings } from "@/features/settings/hooks/useUpdateSettings";

export default function SettingsPage() {
  const { data: serverSettings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending: isSaving } = useUpdateSettings();

  const [localSettings, setLocalSettings] = useState<OrganizationSettings | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (serverSettings && !localSettings) {
      setLocalSettings(serverSettings);
    }
  }, [serverSettings]);

  const hasChanges = serverSettings && localSettings && JSON.stringify(serverSettings) !== JSON.stringify(localSettings);

  const handleChange = (updates: Partial<OrganizationSettings>) => {
    if (!localSettings) return;
    setLocalSettings({ ...localSettings, ...updates });
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!localSettings) return;
    updateSettings(localSettings, {
      onSuccess: () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    });
  };

  const handleDiscard = () => {
    if (serverSettings) setLocalSettings(serverSettings);
  };

  return (
    <AppLayout>
      <div className="max-w-[800px] mx-auto w-full px-4 sm:px-6 py-8 pb-32">
        <SettingsHeader />
        
        {isLoading || !localSettings ? (
          <SettingsSkeleton />
        ) : (
          <div className="space-y-8">
            <OrganizationCard settings={localSettings} onChange={handleChange} />
            <GeneralSettings settings={localSettings} onChange={handleChange} />
            <AppearanceSettings settings={localSettings} onChange={handleChange} />
            <NotificationSettings settings={localSettings} onChange={handleChange} />
            <AISettings settings={localSettings} onChange={handleChange} />
            <BillingCard />
            <DangerZone />
          </div>
        )}
      </div>

      <SaveBar 
        isVisible={!!hasChanges || isSaved} 
        isSaving={isSaving}
        isSaved={isSaved}
        onSave={handleSave} 
        onDiscard={handleDiscard} 
      />
    </AppLayout>
  );
}
