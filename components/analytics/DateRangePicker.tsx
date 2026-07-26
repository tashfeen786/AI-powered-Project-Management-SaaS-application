"use client";

import { Calendar } from "lucide-react";

export function DateRangePicker() {
  return (
    <div className="relative">
      <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center gap-2 hover:bg-background transition-colors focus:outline-none focus:ring-1 focus:ring-primary shrink-0">
        <Calendar className="w-4 h-4 text-text-secondary" />
        Last 30 Days
      </button>
    </div>
  );
}
