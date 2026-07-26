import { AiStatusBadge } from "@/components/requirements/AiStatusBadge";
import { AiStatus } from "@/features/planning/mock-data";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceHeaderProps {
  aiStatus: AiStatus;
  onApprove: () => void;
}

export function WorkspaceHeader({ aiStatus, onApprove }: WorkspaceHeaderProps) {
  const canApprove = aiStatus === 'Ready';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-text-primary">Sprint Planning</h1>
        <AiStatusBadge status={aiStatus as any} />
      </div>
      <button 
        disabled={!canApprove}
        onClick={onApprove}
        className={cn(
          "h-9 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0",
          canApprove ? "bg-primary text-surface hover:opacity-90 shadow-sm hover:-translate-y-0.5" : "bg-surface border border-border text-text-secondary opacity-50 cursor-not-allowed"
        )}
      >
        <Check className="w-4 h-4" />
        Approve Plan
      </button>
    </div>
  );
}
