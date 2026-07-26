import { EstimationData } from "@/features/planning/mock-data";

export function EstimationSummary({ estimations }: { estimations: EstimationData }) {
  if (!estimations) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div className="bg-background border border-border rounded-md p-3">
        <div className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider mb-1">Total Points</div>
        <div className="text-lg font-bold text-text-primary">{estimations.totalStoryPoints}</div>
      </div>
      <div className="bg-background border border-border rounded-md p-3">
        <div className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider mb-1">Total Tasks</div>
        <div className="text-lg font-bold text-text-primary">{estimations.totalTasks}</div>
      </div>
      <div className="bg-background border border-border rounded-md p-3">
        <div className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider mb-1">Est. Hours</div>
        <div className="text-lg font-bold text-text-primary">{estimations.estimatedHours}</div>
      </div>
      <div className="bg-background border border-border rounded-md p-3">
        <div className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider mb-1">Duration</div>
        <div className="text-lg font-bold text-text-primary">{estimations.projectedDuration}</div>
      </div>
    </div>
  );
}
