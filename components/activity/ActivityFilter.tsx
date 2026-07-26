import { Filter, Users, Calendar, ArrowUpDown } from "lucide-react";

export function ActivityFilter() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 -mb-2 custom-scrollbar">
      <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center justify-center gap-2 hover:bg-background transition-colors focus:outline-none shrink-0">
        <Filter className="w-4 h-4 text-text-secondary" />
        Type
      </button>
      <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center justify-center gap-2 hover:bg-background transition-colors focus:outline-none shrink-0">
        <Users className="w-4 h-4 text-text-secondary" />
        User
      </button>
      <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center justify-center gap-2 hover:bg-background transition-colors focus:outline-none shrink-0">
        <Calendar className="w-4 h-4 text-text-secondary" />
        Date Range
      </button>
      
      <div className="w-px h-6 bg-border mx-1 shrink-0"></div>
      
      <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center justify-center gap-2 hover:bg-background transition-colors focus:outline-none shrink-0">
        <ArrowUpDown className="w-4 h-4 text-text-secondary" />
        Newest First
      </button>
    </div>
  );
}
