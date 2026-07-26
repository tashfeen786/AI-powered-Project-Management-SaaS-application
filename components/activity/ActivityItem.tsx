import { ActivityLog } from "@/features/activity/mock-data";
import { ActivityAvatar } from "./ActivityAvatar";
import { ActivityTypeBadge } from "./ActivityTypeBadge";
import { cn } from "@/lib/utils";

export function ActivityItem({ activity }: { activity: ActivityLog }) {
  const isSystem = activity.userName === 'System' || activity.userName === 'AI Assistant';

  return (
    <div className="flex gap-4 relative group">
      <ActivityAvatar initials={activity.userInitials} name={activity.userName} isSystem={isSystem} />
      
      <div className="flex-1 bg-surface border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all duration-150">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-text-primary">{activity.userName}</span>
            <ActivityTypeBadge type={activity.type} />
          </div>
          <span className="text-xs text-text-secondary whitespace-nowrap">{activity.timestamp}</span>
        </div>
        
        <p className="text-sm text-text-secondary leading-relaxed">
          {activity.description}
        </p>
        
        {(activity.taskRef || activity.documentRef) && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            {activity.taskRef && (
              <span className="text-xs font-medium bg-background border border-border text-text-primary px-2 py-1 rounded">
                Task: {activity.taskRef}
              </span>
            )}
            {activity.documentRef && (
              <span className="text-xs font-medium bg-background border border-border text-text-primary px-2 py-1 rounded truncate max-w-[200px]">
                Doc: {activity.documentRef}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
