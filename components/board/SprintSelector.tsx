import { ChevronDown } from "lucide-react";

export function SprintSelector() {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-semibold text-text-primary hover:bg-background transition-colors focus:outline-none focus:ring-1 focus:ring-primary">
      Sprint 1
      <ChevronDown className="w-4 h-4 text-text-secondary" />
    </button>
  );
}
