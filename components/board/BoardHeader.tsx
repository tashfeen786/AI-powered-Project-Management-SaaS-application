import { FilterBar } from "./FilterBar";
import { SprintSelector } from "./SprintSelector";
import { Plus } from "lucide-react";

export function BoardHeader() {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-text-primary">Kanban Board</h1>
          <SprintSelector />
        </div>
        
        <button className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0">
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>
      
      <FilterBar />
    </div>
  );
}
