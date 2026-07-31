import { cn } from "@/lib/utils";
import { TaskPriority } from "@/types/api";

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles = {
    High: "bg-danger/10 text-danger border-danger/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    Low: "bg-primary/10 text-primary border-primary/20"
  };
  return (
    <span className={cn("px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider", styles[priority])}>
      {priority}
    </span>
  );
}
