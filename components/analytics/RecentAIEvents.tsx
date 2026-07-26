import { AIEvent } from "@/features/analytics/mock-data";
import { Sparkles, FileText, Split, CheckCircle2, Bot } from "lucide-react";

export function RecentAIEvents({ events }: { events: AIEvent[] }) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'Generation': return <FileText className="w-4 h-4 text-primary" />;
      case 'Planning': return <Sparkles className="w-4 h-4 text-warning" />;
      case 'Action': return <Split className="w-4 h-4 text-[#0070F3]" />;
      case 'Approval': return <CheckCircle2 className="w-4 h-4 text-success" />;
      default: return <Bot className="w-4 h-4 text-text-secondary" />;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border bg-background/50">
        <h3 className="text-sm font-semibold text-text-primary">Recent AI Activity</h3>
      </div>
      <div className="p-5 flex-1">
        <div className="relative border-l border-border ml-3 space-y-6">
          {events.map((event, idx) => (
            <div key={event.id} className="relative pl-6">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                {getIcon(event.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary leading-tight">{event.description}</p>
                <p className="text-xs text-text-secondary mt-1">{event.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
