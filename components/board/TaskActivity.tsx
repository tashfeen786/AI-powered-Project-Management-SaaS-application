

export function TaskActivity({ activity }: { activity: any[] }) {
  if (!activity || activity.length === 0) return <div className="text-sm text-text-secondary">No recent activity.</div>;

  return (
    <div className="relative pl-4 space-y-6">
      <div className="absolute top-2 bottom-2 left-[5px] w-px bg-border"></div>
      
      {activity.map((item, i) => (
        <div key={item.id} className="relative">
          <div className="absolute -left-[23px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-surface"></div>
          <p className="text-sm text-text-primary">
            <span className="font-semibold">{"User"}</span> {item.type} - {item.description}
          </p>
          <span className="text-xs text-text-secondary">{new Date(item.created_at).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
