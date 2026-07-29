import { ActivityLog } from "@/types/api";
import { ActivityAvatar } from "./ActivityAvatar";
import { ActivityTypeBadge } from "./ActivityTypeBadge";
import { cn } from "@/lib/utils";

export function ActivityItem({ activity }: { activity: ActivityLog }) {
  const mapped = activity as any;
  const isSystem = mapped.userName === 'System' || mapped.userName === 'AI Assistant';

  return (
    <div className="flex gap-4 relative group">
      <ActivityAvatar initials={mapped.userInitials || "U"} name={mapped.userName || "User"} isSystem={isSystem} />
      
      <div className="flex-1 bg-surface border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all duration-150">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-text-primary">{mapped.userName || activity.user_id}</span>
            <ActivityTypeBadge type={mapped.type || activity.action} />
          </div>
          <span className="text-xs text-text-secondary whitespace-nowrap">{mapped.timestamp || new Date(activity.created_at).toLocaleString()}</span>
        </div>
        
        <p className="text-sm text-text-secondary leading-relaxed">
          {mapped.description || activity.details?.message || ""}
        </p>
        
        {(mapped.taskRef || mapped.documentRef || activity.entity_id) && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            {(mapped.taskRef || (activity.entity_type === 'task' ? activity.entity_id : null)) && (
              <span className="text-xs font-medium bg-background border border-border text-text-primary px-2 py-1 rounded">
                Task: {mapped.taskRef || activity.entity_id}
              </span>
            )}
            {(mapped.documentRef || (activity.entity_type === 'document' ? activity.entity_id : null)) && (
              <span className="text-xs font-medium bg-background border border-border text-text-primary px-2 py-1 rounded truncate max-w-[200px]">
                Doc: {mapped.documentRef || activity.entity_id}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
