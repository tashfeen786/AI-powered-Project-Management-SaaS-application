import { AiStatusBadge } from "@/components/requirements/AiStatusBadge";
import { AiStatus } from "@/features/planning/mock-data";
import { Check, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SprintWizard } from "./SprintWizard";

interface WorkspaceHeaderProps {
  aiStatus: AiStatus;
  onApprove: () => void;
  projectId: string;
}

export function WorkspaceHeader({ aiStatus, onApprove, projectId }: WorkspaceHeaderProps) {
  const canApprove = aiStatus === 'Ready';
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isSprintWizardOpen, setIsSprintWizardOpen] = useState(false);

  const handleAiActionClick = () => {
    setIsAiMenuOpen(false);
    setIsSprintWizardOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-text-primary">Sprint Planning</h1>
          <AiStatusBadge status={aiStatus as any} />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
              className="h-9 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              AI Planning
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            
            {isAiMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsAiMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-48 bg-surface border border-border rounded-md shadow-lg z-50 py-1">
                  <button onClick={handleAiActionClick} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Sprint Generator
                  </button>
                  <button onClick={handleAiActionClick} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Risk Analysis
                  </button>
                  <button onClick={handleAiActionClick} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Roadmap
                  </button>
                  <button onClick={handleAiActionClick} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Timeline
                  </button>
                  <button onClick={handleAiActionClick} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Capacity
                  </button>
                </div>
              </>
            )}
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
      </div>

      <SprintWizard
        isOpen={isSprintWizardOpen}
        onClose={() => setIsSprintWizardOpen(false)}
        projectId={projectId}
        existingSprint={null}
      />
    </>
  );
}
