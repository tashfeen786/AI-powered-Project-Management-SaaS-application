import { useSprints } from "@/features/sprints/hooks/useSprints";
import { Loader2, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { SprintResponse } from "@/types/api";

export function CurrentSprintCard({ projectId }: { projectId: string }) {
  // Query specifically for the active sprint
  const { data, isLoading } = useSprints(projectId, { status: "Active", limit: 1 });

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-5 flex items-center justify-center min-h-[160px]">
        <Loader2 className="w-6 h-6 animate-spin text-text-secondary" />
      </div>
    );
  }

  const activeSprint: SprintResponse | undefined = data?.items?.[0];

  if (!activeSprint) {
    return (
      <div className="bg-surface border border-border border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center">
        <Calendar className="w-8 h-8 text-text-secondary opacity-50 mb-3" />
        <h3 className="text-sm font-semibold text-text-primary mb-1">No Active Sprint</h3>
        <p className="text-xs text-text-secondary">Plan and start a sprint to track progress here.</p>
      </div>
    );
  }

  // Mock progress calculation for demo purposes (can be updated when tasks are fully integrated)
  const progressPercent = 65; 

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Current Sprint: {activeSprint.name}
          </h3>
          <p className="text-xs text-text-secondary mt-1 max-w-[80%] truncate">
            {activeSprint.goal || "No specific goal defined."}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-text-primary">{activeSprint.story_points || 0}</div>
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mt-0.5">Points</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-medium text-text-primary">Sprint Progress</span>
            <span className="text-text-secondary">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-background border border-border rounded-md p-3 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Velocity Trend
            </div>
            <div className="text-sm font-semibold text-text-primary">{activeSprint.velocity || 0} pts / wk</div>
          </div>
          <div className="bg-background border border-border rounded-md p-3 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-warning" />
              Days Remaining
            </div>
            <div className="text-sm font-semibold text-text-primary">
              {activeSprint.duration ? `${activeSprint.duration * 7} Days` : "Unknown"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
