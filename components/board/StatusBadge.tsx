import { cn } from "@/lib/utils";
import { TaskStatus } from "@/features/tasks/mock-data";

export function StatusBadge({ status }: { status: TaskStatus }) {
  const styles = {
    "To Do": "bg-surface border-border text-text-secondary",
    "In Progress": "bg-primary/10 border-primary/20 text-primary",
    "Review": "bg-warning/10 border-warning/20 text-warning",
    "Done": "bg-success/10 border-success/20 text-success"
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider", styles[status])}>
      {status}
    </span>
  );
}
