import { Users } from "lucide-react";

export function EmptyTeam({ onInviteClick }: { onInviteClick: () => void }) {
  return (
    <div className="w-full bg-surface border border-border rounded-lg border-dashed p-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-text-secondary" />
      </div>
      <h2 className="text-lg font-semibold text-text-primary mb-2">No team members yet</h2>
      <p className="text-text-secondary text-sm max-w-sm mb-6">
        Start collaborating by inviting your first team member to the organization.
      </p>
      <button 
        onClick={onInviteClick}
        className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Invite Member
      </button>
    </div>
  );
}
