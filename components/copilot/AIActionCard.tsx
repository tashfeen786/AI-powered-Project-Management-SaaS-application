"use client";

import { CopilotAction } from "@/features/copilot/mock-data";
import { Play } from "lucide-react";

export function AIActionCard({ action }: { action: CopilotAction }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-surface border border-primary/30 rounded-md text-xs font-medium text-primary hover:bg-primary/5 hover:border-primary transition-colors group">
      <Play className="w-3 h-3 fill-primary/20 group-hover:fill-primary transition-colors" />
      {action.label}
    </button>
  );
}
