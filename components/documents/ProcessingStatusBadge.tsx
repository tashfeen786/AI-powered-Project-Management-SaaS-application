import { cn } from "@/lib/utils";
import { DocStatus } from "@/features/documents/mock-data";

export function ProcessingStatusBadge({ status }: { status: DocStatus }) {
  const styles = {
    "Uploaded": "bg-surface border-border text-text-secondary",
    "Processing": "bg-warning/10 border-warning/20 text-warning animate-pulse",
    "Processed": "bg-success/10 border-success/20 text-success",
    "Failed": "bg-danger/10 border-danger/20 text-danger",
    "Unsupported": "bg-surface border-border text-text-primary"
  };
  
  return (
    <span className={cn("px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider whitespace-nowrap", styles[status])}>
      {status}
    </span>
  );
}
