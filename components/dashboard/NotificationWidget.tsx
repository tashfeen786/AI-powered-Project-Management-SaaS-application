import { Notification } from "@/features/dashboard/types";
import { Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationWidget({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-[100%] max-h-[300px]">
      <div className="px-5 py-4 border-b border-border bg-background flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-text-secondary" />
          <h2 className="text-sm font-semibold text-text-primary">Notifications</h2>
        </div>
      </div>
      <div className="flex-col overflow-y-auto">
        {notifications.map(n => (
          <div key={n.id} className={cn("p-4 border-b border-border last:border-0 hover:bg-background transition-colors duration-150 flex items-start justify-between gap-3 group", !n.read && "bg-background/50")}>
            <div className="flex items-start gap-3 flex-1">
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
              <div>
                <p className={cn("text-sm line-clamp-2", n.read ? "text-text-secondary" : "text-text-primary font-medium")}>{n.title}</p>
                <p className="text-xs text-text-secondary mt-1">{n.time}</p>
              </div>
            </div>
            {!n.read && (
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-text-secondary hover:text-success rounded-md hover:bg-surface focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary shrink-0">
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
