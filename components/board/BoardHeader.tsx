import { FilterBar } from "./FilterBar";
import { SprintSelector } from "./SprintSelector";
import { Plus, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";

interface BoardHeaderProps {
  onCreateClick?: () => void;
  filters: any;
  setFilters: (f: any) => void;
}

export function BoardHeader({ onCreateClick, filters, setFilters }: BoardHeaderProps) {
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-text-primary">Kanban Board</h1>
          <SprintSelector />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
              className="h-9 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Board AI
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            
            {isAiMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsAiMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-48 bg-surface border border-border rounded-md shadow-lg z-50 py-1">
                  <button className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Task Breakdown
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Subtask Generation
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Suggestions
                  </button>
                </div>
              </>
            )}
          </div>
          
          <button 
            onClick={onCreateClick}
            className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>
      
      <FilterBar 
        search={filters.search}
        onSearchChange={(v) => setFilters({ ...filters, search: v })}
        assigneeId={filters.assigneeId}
        onAssigneeChange={(v) => setFilters({ ...filters, assigneeId: v })}
        priority={filters.priority}
        onPriorityChange={(v) => setFilters({ ...filters, priority: v })}
        phase={filters.phase}
        onPhaseChange={(v) => setFilters({ ...filters, phase: v })}
        isAiGenerated={filters.isAiGenerated}
        onAiGeneratedChange={(v) => setFilters({ ...filters, isAiGenerated: v })}
      />
    </div>
  );
}
