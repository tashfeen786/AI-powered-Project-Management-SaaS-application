import { AnalyticsData } from "@/features/analytics/mock-data";
import { Calendar, Target, Clock, Activity } from "lucide-react";

export function DeliveryForecastCard({ forecast }: { forecast: AnalyticsData['deliveryForecast'] }) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border bg-background/50">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Target className="w-4 h-4 text-text-secondary" />
          Delivery Forecast
        </h3>
      </div>
      <div className="p-5 flex-1 grid grid-cols-2 gap-4">
        
        <div className="col-span-2 p-4 border border-border rounded-lg bg-background flex flex-col items-center justify-center text-center">
          <Calendar className="w-6 h-6 text-primary mb-2" />
          <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Predicted Date</div>
          <div className="text-2xl font-bold text-text-primary">{forecast.predictedDate}</div>
        </div>

        <div className="p-4 border border-border rounded-lg bg-background flex flex-col">
          <div className="text-xs text-text-secondary mb-1 flex items-center gap-1">
            <Target className="w-3 h-3" /> Confidence
          </div>
          <div className="text-lg font-bold text-text-primary">{forecast.confidence}%</div>
        </div>

        <div className="p-4 border border-border rounded-lg bg-background flex flex-col">
          <div className="text-xs text-text-secondary mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Est. Delay
          </div>
          <div className="text-lg font-bold text-warning">{forecast.estimatedDelay}</div>
        </div>

        <div className="col-span-2 p-4 border border-border rounded-lg bg-background flex flex-col">
          <div className="text-xs text-text-secondary mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Schedule Health
          </div>
          <div className="text-lg font-bold text-success">{forecast.scheduleHealth}</div>
        </div>

      </div>
    </div>
  );
}
