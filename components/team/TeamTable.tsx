import { TeamMemberResponse, TeamRole } from "@/types/api";
import { RoleBadge } from "./RoleBadge";
import { ChangeRoleDropdown } from "./ChangeRoleDropdown";
import { MoreVertical, Trash2 } from "lucide-react";

interface TeamTableProps {
  members: TeamMemberResponse[];
  onUpdateRole: (id: string, role: TeamRole) => void;
  onRemoveMember: (member: TeamMemberResponse) => void;
}

export function TeamTable({ members, onUpdateRole, onRemoveMember }: TeamTableProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden hidden md:block">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-background border-b border-border">
            <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Member</th>
            <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Role</th>
            <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Joined</th>
            <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
            <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {members.map(member => (
            <tr key={member.user_id} className="hover:bg-background/50 transition-colors group">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {member.full_name ? member.full_name.substring(0, 2).toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{member.full_name || member.email}</div>
                    <div className="text-xs text-text-secondary">{member.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <ChangeRoleDropdown 
                  currentRole={member.role} 
                  onRoleChange={(r) => onUpdateRole(member.user_id, r)} 
                  disabled={member.role === 'owner'} 
                />
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary">{new Date(member.created_at).toLocaleDateString()}</td>
              <td className="py-3 px-4">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${member.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {member.status}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <button 
                  onClick={() => onRemoveMember(member)}
                  disabled={member.role === 'owner'}
                  className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded transition-colors disabled:opacity-30 disabled:hover:text-text-secondary disabled:hover:bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
