import { cn } from "@/lib/utils";

type PriorityType = "High" | "Medium" | "Low";

export function PriorityBadge({ priority }: { priority: PriorityType | string }) {
  const getStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-danger/10 text-danger";
      case "Medium":
        return "bg-warning/10 text-warning";
      case "Low":
        return "bg-primary/10 text-primary";
      default:
        return "bg-surface text-text-secondary";
    }
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider", getStyles(priority))}>
      {priority}
    </span>
  );
}
