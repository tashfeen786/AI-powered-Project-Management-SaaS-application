import { Lock } from "lucide-react";

export function LockedFieldIndicator() {
  return (
    <div className="flex items-center gap-1 text-[10px] font-medium text-warning bg-warning/10 px-1.5 py-0.5 rounded border border-warning/20" title="AI will not overwrite this field.">
      <Lock className="w-3 h-3" />
      Locked
    </div>
  );
}
