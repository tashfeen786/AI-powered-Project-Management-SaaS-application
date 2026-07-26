import { UserPlus } from "lucide-react";

interface TeamHeaderProps {
  onInviteClick: () => void;
}

export function TeamHeader({ onInviteClick }: TeamHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary mb-1">Team Members</h1>
        <p className="text-sm text-text-secondary">Manage your organization members and roles.</p>
      </div>
      
      <button 
        onClick={onInviteClick}
        className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
      >
        <UserPlus className="w-4 h-4" />
        Invite Member
      </button>
    </div>
  );
}
