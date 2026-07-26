"use client";

import { SRSData } from "@/features/requirements/mock-data";
import { DraftSection } from "./DraftSection";
import { DraftSaveIndicator } from "./DraftSaveIndicator";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { AssumptionsPanel } from "./AssumptionsPanel";
import { MissingInfoPanel } from "./MissingInfoPanel";

interface DraftPanelProps {
  draft: SRSData;
  isSaving: boolean;
  onUpdateSection: (id: string, content: string) => void;
}

export function DraftPanel({ draft, isSaving, onUpdateSection }: DraftPanelProps) {
  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border bg-[#F5F3FF] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-primary">Live SRS Draft</h2>
          <DraftSaveIndicator isSaving={isSaving} />
        </div>
        <ConfidenceBadge level={draft.confidence} />
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-surface">
        <MissingInfoPanel missingInfo={draft.missingInfo} />
        <AssumptionsPanel assumptions={draft.assumptions} />
        
        <div className="mt-6">
          {draft.sections.map(section => (
            <DraftSection 
              key={section.id} 
              section={section} 
              onUpdate={onUpdateSection}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
