import { TeamPerformance } from "@/features/analytics/mock-data";
import { cn } from "@/lib/utils";

export function TeamPerformanceTable({ data }: { data: TeamPerformance[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border bg-background/50">
        <h3 className="text-sm font-semibold text-text-primary">Team Performance</h3>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Member</th>
              <th className="py-3 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Velocity</th>
              <th className="py-3 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Completed</th>
              <th className="py-3 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Active</th>
              <th className="py-3 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map(member => (
              <tr key={member.id} className="hover:bg-background/50 transition-colors">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{member.member}</div>
                      <div className="text-xs text-text-secondary">{member.role}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 text-right font-medium text-text-primary">{member.velocity}</td>
                <td className="py-3 px-5 text-right text-text-secondary">{member.completedTasks}</td>
                <td className="py-3 px-5 text-right text-text-secondary">{member.activeTasks}</td>
                <td className="py-3 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", member.efficiency >= 90 ? "bg-success" : member.efficiency >= 70 ? "bg-warning" : "bg-danger")} 
                        style={{ width: `${member.efficiency}%` }} 
                      />
                    </div>
                    <span className="text-xs font-medium text-text-primary w-8 text-right">{member.efficiency}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
