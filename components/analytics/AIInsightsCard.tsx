import { Sparkles } from "lucide-react";

export function AIInsightsCard({ insights }: { insights: string[] }) {
  return (
    <div className="bg-surface border border-primary/20 rounded-lg overflow-hidden flex flex-col h-full relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
      <div className="px-5 py-4 border-b border-border bg-background/30 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-text-primary">AI Insights</h3>
      </div>
      <div className="p-5 flex-1 flex flex-col gap-3">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-md bg-background border border-border/50">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <p className="text-sm text-text-primary leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
