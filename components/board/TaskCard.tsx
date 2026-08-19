import { TaskResponse } from "@/types/api";
import { PriorityBadge } from "./PriorityBadge";
import { AssigneeAvatar } from "./AssigneeAvatar";
import { MessageSquare, Paperclip, Calendar, Sparkles, GitMerge } from "lucide-react";

interface TaskCardProps {
  task: TaskResponse;
  onClick: (task: TaskResponse) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export function TaskCard({ task, onClick, onDragStart }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      className="bg-surface border border-border rounded p-3 mb-2 last:mb-0 cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-sm transition-all group select-none"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-text-primary leading-snug pr-2">
          {task.title}
        </h4>
        {(task.phase || (task.requirement_ids && task.requirement_ids.length > 0)) && (
          <div title="AI Generated Task" className="text-primary mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {task.phase && (
        <div className="mb-2">
          <span className="bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
            {task.phase}
          </span>
        </div>
      )}

      {task.requirement_ids && task.requirement_ids.length > 0 && (
        <div className="flex items-center gap-1 text-[10px] font-medium text-text-secondary mb-2 bg-background border border-border rounded px-1.5 py-0.5 w-fit">
          <GitMerge className="w-3 h-3" />
          Req: {task.requirement_ids.map(id => id.substring(0, 6)).join(", ")}
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <PriorityBadge priority={task.priority} />
        <span className="bg-background text-text-secondary border border-border px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
          {task.story_points || 0} SP
        </span>
      </div>
      
      <div className="flex items-center justify-between text-text-secondary mt-auto pt-1">
        <div className="flex items-center gap-3">
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-medium">
              <MessageSquare className="w-3.5 h-3.5" />
              {task.comments.length}
            </div>
          )}
          <div className="flex items-center gap-1 text-[11px] font-medium" title="Due Date">
            <Calendar className="w-3.5 h-3.5" />
            {task.due_date ? task.due_date : "No date"}
          </div>
        </div>
        <AssigneeAvatar 
          initials={task.assignee ? task.assignee.full_name.substring(0, 2).toUpperCase() : "UN"} 
          name={task.assignee ? task.assignee.full_name : "Unassigned"} 
        />
      </div>
    </div>
  );
}
