import { FileUp, Settings, Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  projectId: string;
  onInviteClick: () => void;
}

export function QuickActions({ projectId, onInviteClick }: QuickActionsProps) {
  const router = useRouter();

  const actions = [
    { title: "Create Task", icon: Plus, onClick: () => router.push(`/projects/${projectId}/board`) },
    { title: "Upload Document", icon: FileUp, onClick: () => router.push(`/projects/${projectId}/documents`) },
    { title: "Invite Team Member", icon: UserPlus, onClick: onInviteClick },
    { title: "Project Settings", icon: Settings, onClick: () => router.push(`/projects/${projectId}/settings`) },
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((action, i) => (
          <button 
            key={i} 
            onClick={action.onClick}
            className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm text-text-primary hover:bg-background transition-colors focus:outline-none focus:ring-1 focus:ring-primary border border-transparent hover:border-border group"
          >
            <div className="w-7 h-7 rounded bg-background text-text-secondary flex items-center justify-center shrink-0 border border-border group-hover:text-primary group-hover:border-primary/30 transition-colors">
              <action.icon className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
