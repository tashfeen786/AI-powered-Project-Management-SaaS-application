import { Bell, Check } from "lucide-react";

interface NotificationCardProps {
  notifications: Array<any>;
}

export function NotificationCard({ notifications }: NotificationCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-background flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-text-secondary" />
          <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
        </div>
        <button className="text-xs text-primary hover:underline font-medium">Mark all read</button>
      </div>
      <div className="flex flex-col max-h-[300px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-text-secondary">No unread notifications</div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="p-3 border-b border-border last:border-0 hover:bg-background transition-colors duration-150 flex items-start gap-3 group">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary line-clamp-2">{notif.title}</p>
                <p className="text-xs text-text-secondary mt-1">{notif.time}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-text-secondary hover:text-success rounded-md hover:bg-surface focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
