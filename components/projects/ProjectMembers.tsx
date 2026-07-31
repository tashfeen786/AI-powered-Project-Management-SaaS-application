export function ProjectMembers({ members }: { members: any[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Team Members</h3>
      <div className="flex flex-wrap gap-2">
        {members.map((member, i) => {
          const displayName = member.full_name || member.email || `Member ${i+1}`;
          const initials = displayName.substring(0, 2).toUpperCase();
          
          return (
            <div key={member.id || i} className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                {initials}
              </div>
              <span className="text-xs font-medium text-text-primary">{displayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
