import { Search, Filter, Users, Hash } from "lucide-react";

export function FilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="h-9 pl-9 pr-4 bg-surface border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary w-64"
        />
      </div>
      
      <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center gap-2 hover:bg-background transition-colors focus:outline-none">
        <Users className="w-4 h-4 text-text-secondary" />
        Assignee
      </button>
      
      <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center gap-2 hover:bg-background transition-colors focus:outline-none">
        <Filter className="w-4 h-4 text-text-secondary" />
        Priority
      </button>

      <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center gap-2 hover:bg-background transition-colors focus:outline-none">
        <Hash className="w-4 h-4 text-text-secondary" />
        Epic
      </button>
    </div>
  );
}
