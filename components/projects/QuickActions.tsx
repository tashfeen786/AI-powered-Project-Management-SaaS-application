import { Sparkles, Calendar, Layout, UserPlus } from "lucide-react";

export function QuickActions() {
  const actions = [
    { title: "Generate SRS", icon: Sparkles },
    { title: "Sprint Planning", icon: Calendar },
    { title: "Open Board", icon: Layout },
    { title: "Invite Team", icon: UserPlus },
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((action, i) => (
          <button 
            key={i} 
            className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm text-text-primary hover:bg-background transition-colors focus:outline-none focus:ring-1 focus:ring-primary border border-transparent hover:border-border"
          >
            <div className="w-7 h-7 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <action.icon className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
