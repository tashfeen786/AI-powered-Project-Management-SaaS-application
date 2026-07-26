import { Search } from "lucide-react";
import { ActivityFilter } from "./ActivityFilter";

export function ActivityToolbar() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="relative w-full sm:w-72 shrink-0">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search activity..."
          className="w-full h-9 pl-9 pr-4 bg-surface border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      
      <div className="w-full sm:w-auto overflow-hidden">
        <ActivityFilter />
      </div>
    </div>
  );
}
