import { cn } from "@/lib/utils";

type StatusType = "Planning" | "Active" | "Review" | "Completed";

export function StatusBadge({ status }: { status: StatusType | string }) {
  const getStyles = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-surface border-border text-text-secondary";
      case "Active":
        return "bg-primary/10 border-primary/20 text-primary";
      case "Review":
        return "bg-warning/10 border-warning/20 text-warning";
      case "Completed":
        return "bg-success/10 border-success/20 text-success";
      default:
        return "bg-surface border-border text-text-secondary";
    }
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider", getStyles(status))}>
      {status}
    </span>
  );
}
