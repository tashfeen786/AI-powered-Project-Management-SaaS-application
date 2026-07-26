import { TaskData } from "@/features/planning/mock-data";
import { cn } from "@/lib/utils";
import { LockedFieldIndicator } from "@/components/requirements/LockedFieldIndicator";

export function TaskCard({ task }: { task: TaskData }) {
  const priorityColors = {
    High: "bg-danger/10 text-danger border-danger/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    Low: "bg-primary/10 text-primary border-primary/20"
  };

  return (
    <div className="bg-surface border border-border rounded p-3 mb-2 last:mb-0 hover:border-primary/50 transition-colors group cursor-text">
      <div className="flex items-start justify-between mb-2">
        <h5 className="text-sm font-medium text-text-primary">{task.title}</h5>
        {task.isLocked && <LockedFieldIndicator />}
      </div>
      <p className="text-xs text-text-secondary mb-3">{task.description}</p>
      
      <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-wider">
        <div className="flex items-center gap-2">
          <span className={cn("px-1.5 py-0.5 rounded border", priorityColors[task.priority])}>
            {task.priority}
          </span>
          <span className="bg-background text-text-secondary border border-border px-1.5 py-0.5 rounded">
            {task.storyPoints} SP
          </span>
          <span className="bg-background text-text-secondary border border-border px-1.5 py-0.5 rounded hidden sm:inline-block">
            {task.estimatedHours}h
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-background text-text-primary border border-border px-1.5 py-0.5 rounded">
            {task.status}
          </span>
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[9px] border border-primary/20" title={task.assignee}>
            {task.assignee.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
