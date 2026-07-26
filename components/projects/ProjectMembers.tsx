export function ProjectMembers({ members }: { members: string[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Team Members</h3>
      <div className="flex flex-wrap gap-2">
        {members.map((member, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
              {member}
            </div>
            <span className="text-xs font-medium text-text-primary">User {member}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
