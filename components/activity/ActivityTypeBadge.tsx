import { cn } from "@/lib/utils";
import { ActivityType } from "@/features/activity/mock-data";
import { CheckCircle2, FileText, Sparkles, UserPlus, Settings, FileBox } from "lucide-react";

export function ActivityTypeBadge({ type }: { type: string }) {
  const getStyles = () => {
    const t = type.toLowerCase();
    if (t.includes('approved') || t.includes('completed')) return { color: "text-success bg-success/10 border-success/20", icon: CheckCircle2 };
    if (t.includes('ai') || t.includes('generated')) return { color: "text-primary bg-primary/10 border-primary/20", icon: Sparkles };
    if (t.includes('document')) return { color: "text-warning bg-warning/10 border-warning/20", icon: FileText };
    if (t.includes('member') || t.includes('role')) return { color: "text-text-primary bg-surface border-border", icon: UserPlus };
    if (t.includes('task')) return { color: "text-text-primary bg-surface border-border", icon: FileBox };
    return { color: "text-text-secondary bg-surface border-border", icon: Settings };
  };

  const { color, icon: Icon } = getStyles();
  const displayType = type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-semibold tracking-wide", color)}>
      <Icon className="w-3 h-3" />
      {displayType}
    </span>
  );
}
