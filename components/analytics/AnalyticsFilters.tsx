"use client";

import { RefreshCw } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";
import { ExportMenu } from "./ExportMenu";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function AnalyticsFilters() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["analytics"] }).finally(() => {
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <DateRangePicker />
      <ExportMenu />
      <button 
        onClick={handleRefresh}
        className="w-9 h-9 flex items-center justify-center bg-surface border border-border rounded-md text-text-secondary hover:text-text-primary hover:bg-background transition-colors"
        title="Refresh Data"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
      </button>
    </div>
  );
}
