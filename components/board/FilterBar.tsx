import { Search, Filter, Users, Sparkles, Box } from "lucide-react";
import { useMembers } from "@/features/team/hooks/useMembers";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  assigneeId: string;
  onAssigneeChange: (val: string) => void;
  priority: string;
  onPriorityChange: (val: string) => void;
  phase: string;
  onPhaseChange: (val: string) => void;
  isAiGenerated: boolean;
  onAiGeneratedChange: (val: boolean) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  assigneeId,
  onAssigneeChange,
  priority,
  onPriorityChange,
  phase,
  onPhaseChange,
  isAiGenerated,
  onAiGeneratedChange
}: FilterBarProps) {
  const { data: members } = useMembers();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="h-9 pl-9 pr-4 bg-surface border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary w-64"
        />
      </div>
      
      <div className="relative flex items-center">
        <Users className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
        <select 
          value={assigneeId}
          onChange={(e) => onAssigneeChange(e.target.value)}
          className="h-9 pl-9 pr-8 bg-surface border border-border rounded-md text-sm font-medium text-text-primary hover:bg-background transition-colors focus:outline-none appearance-none"
        >
          <option value="">All Assignees</option>
          <option value="unassigned">Unassigned</option>
          {members?.map(m => (
            <option key={m.user_id} value={m.user_id}>{m.full_name || m.email}</option>
          ))}
        </select>
      </div>
      
      <div className="relative flex items-center">
        <Filter className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
        <select 
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-9 pl-9 pr-8 bg-surface border border-border rounded-md text-sm font-medium text-text-primary hover:bg-background transition-colors focus:outline-none appearance-none"
        >
          <option value="">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="relative flex items-center">
        <Box className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
        <select 
          value={phase}
          onChange={(e) => onPhaseChange(e.target.value)}
          className="h-9 pl-9 pr-8 bg-surface border border-border rounded-md text-sm font-medium text-text-primary hover:bg-background transition-colors focus:outline-none appearance-none max-w-[150px]"
        >
          <option value="">All Phases</option>
          <option value="Project Setup & Foundation">Project Setup & Foundation</option>
          <option value="Backend Development">Backend Development</option>
          <option value="Frontend Development">Frontend Development</option>
          <option value="Integration & Testing">Integration & Testing</option>
          <option value="Deployment & Release">Deployment & Release</option>
        </select>
      </div>
      
      <button 
        onClick={() => onAiGeneratedChange(!isAiGenerated)}
        className={`h-9 px-3 border rounded-md text-sm font-medium flex items-center gap-2 transition-colors focus:outline-none ${isAiGenerated ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface border-border text-text-primary hover:bg-background'}`}
      >
        <Sparkles className={`w-4 h-4 ${isAiGenerated ? 'text-primary' : 'text-text-secondary'}`} />
        AI Generated Only
      </button>
    </div>
  );
}
