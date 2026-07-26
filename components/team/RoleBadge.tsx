import { cn } from "@/lib/utils";
import { TeamRole } from "@/features/team/mock-data";

export function RoleBadge({ role }: { role: TeamRole }) {
  const getStyles = () => {
    switch (role) {
      case 'Owner': return "bg-primary/10 text-primary border-primary/20";
      case 'Project Manager': return "bg-success/10 text-success border-success/20";
      case 'Developer': return "bg-surface border-border text-text-primary";
      case 'Designer': return "bg-warning/10 text-warning border-warning/20";
      case 'QA': return "bg-danger/10 text-danger border-danger/20";
      default: return "bg-surface border-border text-text-secondary";
    }
  };

  return (
    <span className={cn("px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap", getStyles())}>
      {role}
    </span>
  );
}
