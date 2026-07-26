import { AnalyticsData } from "@/features/analytics/mock-data";
import { AlertTriangle, TrendingUp, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function RiskPredictionCard({ risk }: { risk: AnalyticsData['riskPrediction'] }) {
  const getRiskColor = (level: string) => {
    switch(level) {
      case 'Low': return 'text-success bg-success/10 border-success/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'High': return 'text-danger bg-danger/10 border-danger/20';
      default: return 'text-text-secondary bg-border border-border';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border bg-background/50 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-danger" />
          Risk Prediction
        </h3>
        <span className="text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded border border-danger/20">
          SCORE: {risk.overallScore}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-center gap-4">
        
        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Budget Risk</span>
          </div>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", getRiskColor(risk.budgetRisk))}>
            {risk.budgetRisk}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Timeline Risk</span>
          </div>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", getRiskColor(risk.timelineRisk))}>
            {risk.timelineRisk}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Team Capacity</span>
          </div>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", getRiskColor(risk.teamCapacityRisk))}>
            {risk.teamCapacityRisk}
          </span>
        </div>

      </div>
    </div>
  );
}
