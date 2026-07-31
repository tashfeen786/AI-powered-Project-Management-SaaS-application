import { TeamMemberResponse, TeamRole } from "@/types/api";
import { ChangeRoleDropdown } from "./ChangeRoleDropdown";
import { Trash2 } from "lucide-react";

interface TeamMobileCardProps {
  member: TeamMemberResponse;
  onUpdateRole: (id: string, role: TeamRole) => void;
  onRemoveMember: (member: TeamMemberResponse) => void;
}

export function TeamMobileCard({ member, onUpdateRole, onRemoveMember }: TeamMobileCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-3 md:hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {member.full_name ? member.full_name.substring(0, 2).toUpperCase() : "U"}
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">{member.full_name || member.email}</div>
            <div className="text-xs text-text-secondary">{member.email}</div>
          </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${member.status === 'accepted' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
          {member.status}
        </span>
      </div>
      
      <div className="flex items-center justify-between border-t border-border pt-3">
        <ChangeRoleDropdown 
          currentRole={member.role} 
          onRoleChange={(r) => onUpdateRole(member.user_id, r)} 
          disabled={member.role === 'owner'} 
        />
        <button 
          onClick={() => onRemoveMember(member)}
          disabled={member.role === 'owner'}
          className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded transition-colors disabled:opacity-30"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
