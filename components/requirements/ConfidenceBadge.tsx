import { cn } from "@/lib/utils";
import { ConfidenceLevel } from "@/features/requirements/mock-data";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const config = {
    'High': { icon: ShieldCheck, color: 'text-success bg-success/10 border-success/20' },
    'Medium': { icon: Shield, color: 'text-warning bg-warning/10 border-warning/20' },
    'Low': { icon: ShieldAlert, color: 'text-danger bg-danger/10 border-danger/20' },
  };
  const { icon: Icon, color } = config[level] || config['Medium'];

  return (
    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold border", color)} title={`AI Confidence: ${level}`}>
      <Icon className="w-3 h-3" />
      {level}
    </div>
  );
}
