import { TeamRecommendation } from "@/features/planning/mock-data";
import { Users, Clock } from "lucide-react";

export function TeamRecommendationCard({ team }: { team: TeamRecommendation }) {
  if (!team) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-5 mb-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        Recommended Team Structure
      </h3>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 bg-background border border-border rounded px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Developers</span>
          <span className="text-sm font-bold text-text-primary">{team.developers}</span>
        </div>
        <div className="flex-1 bg-background border border-border rounded px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">QA</span>
          <span className="text-sm font-bold text-text-primary">{team.qa}</span>
        </div>
        <div className="flex-1 bg-background border border-border rounded px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Designers</span>
          <span className="text-sm font-bold text-text-primary">{team.designers}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
        <Clock className="w-3.5 h-3.5" />
        <span>Estimated Duration:</span>
        <span className="text-text-primary font-bold">{team.estimatedDuration}</span>
      </div>
    </div>
  );
}
