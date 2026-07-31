import { Sparkles, Calendar, Layout, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  projectId: string;
  onInviteClick: () => void;
  onGenerateSRSClick: () => void;
  onSprintWizardClick: () => void;
}

export function QuickActions({ projectId, onInviteClick, onGenerateSRSClick, onSprintWizardClick }: QuickActionsProps) {
  const router = useRouter();

  const actions = [
    { title: "Generate SRS", icon: Sparkles, onClick: onGenerateSRSClick },
    { title: "Sprint Planning", icon: Calendar, onClick: onSprintWizardClick },
    { title: "Open Board", icon: Layout, onClick: () => router.push(`/projects/${projectId}/board`) },
    { title: "Invite Team", icon: UserPlus, onClick: onInviteClick },
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((action, i) => (
          <button 
            key={i} 
            onClick={action.onClick}
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
