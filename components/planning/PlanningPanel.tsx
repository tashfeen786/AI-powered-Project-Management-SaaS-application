"use client";

import { PlanningData } from "@/features/planning/mock-data";
import { DraftSaveIndicator } from "@/components/requirements/DraftSaveIndicator";
import { ConfidenceBadge } from "@/components/requirements/ConfidenceBadge";
import { PlanningRisksPanel } from "./PlanningRisksPanel";
import { EstimationSummary } from "./EstimationSummary";
import { TeamRecommendationCard } from "./TeamRecommendationCard";
import { PlanningTree } from "./PlanningTree";

interface PlanningPanelProps {
  draft: PlanningData;
  isSaving: boolean;
}

export function PlanningPanel({ draft, isSaving }: PlanningPanelProps) {
  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border bg-[#F5F3FF] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-primary">Live Sprint Plan</h2>
          <DraftSaveIndicator isSaving={isSaving} />
        </div>
        <ConfidenceBadge level={draft.confidence} />
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-surface">
        <PlanningRisksPanel risks={draft.risks} />
        <TeamRecommendationCard team={draft.team} />
        <EstimationSummary estimations={draft.estimations} />
        
        <div className="border-t border-border pt-6 mt-2">
          <PlanningTree milestones={draft.milestones} />
        </div>
      </div>
    </div>
  );
}
