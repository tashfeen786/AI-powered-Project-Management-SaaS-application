export function AssigneeAvatar({ initials, name }: { initials: string; name: string }) {
  return (
    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary" title={name}>
      {initials}
    </div>
  );
}
