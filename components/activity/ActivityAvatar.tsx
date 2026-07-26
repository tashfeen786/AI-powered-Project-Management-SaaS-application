import { cn } from "@/lib/utils";

export function ActivityAvatar({ initials, name, isSystem }: { initials: string; name: string; isSystem?: boolean }) {
  return (
    <div 
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border z-10 ring-4 ring-background shrink-0 mt-0.5",
        isSystem ? "bg-surface border-border text-text-secondary" : "bg-primary/10 border-primary/20 text-primary"
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
