interface ActivityItemProps {
  activity: {
    user: string;
    avatar: string;
    action: string;
    time: string;
  };
  isLast: boolean;
}

export function ActivityItem({ activity, isLast }: ActivityItemProps) {
  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-[-8px] w-px bg-border" />
      )}
      <div className="relative w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-medium text-text-primary shrink-0 z-10">
        {activity.avatar}
      </div>
      <div className="flex-1 pb-4">
        <p className="text-sm text-text-primary leading-tight">
          <span className="font-medium">{activity.user}</span> {activity.action}
        </p>
        <p className="text-xs text-text-secondary mt-1">{activity.time}</p>
      </div>
    </div>
  );
}
