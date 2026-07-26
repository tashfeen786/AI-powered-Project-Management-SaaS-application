import { cn } from "@/lib/utils";
import { Loader2, RefreshCw, CheckCircle2, Sparkles } from "lucide-react";
import { AiStatus } from "@/features/requirements/mock-data";

export function AiStatusBadge({ status }: { status: AiStatus }) {
  const config = {
    'Thinking': { icon: Loader2, color: 'text-primary bg-primary/10 border-primary/20', animate: 'animate-spin' },
    'Updating Draft': { icon: RefreshCw, color: 'text-warning bg-warning/10 border-warning/20', animate: 'animate-spin' },
    'Ready': { icon: CheckCircle2, color: 'text-success bg-success/10 border-success/20', animate: '' },
    'Generating Final Version': { icon: Sparkles, color: 'text-primary bg-primary/10 border-primary/20', animate: 'animate-pulse' },
  };
  const { icon: Icon, color, animate } = config[status] || config['Ready'];

  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium", color)}>
      <Icon className={cn("w-3.5 h-3.5", animate)} />
      {status}
    </div>
  );
}
