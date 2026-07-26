import { Activity } from "@/features/dashboard/types";

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-text-primary mb-5">Recent Activity</h2>
      <div className="flex flex-col">
        {activities.map((activity, idx) => (
          <div key={activity.id} className="relative flex gap-4 pb-4 last:pb-0 group">
            {idx !== activities.length - 1 && (
              <div className="absolute left-[5px] top-4 bottom-[-16px] w-px bg-border group-hover:bg-primary/20 transition-colors duration-150" />
            )}
            <div className="relative w-3 h-3 rounded-full bg-background border-2 border-primary shrink-0 z-10 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-text-primary">{activity.title}</p>
              <p className="text-xs text-text-secondary mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
