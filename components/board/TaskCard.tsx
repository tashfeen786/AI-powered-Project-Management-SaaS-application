import { Task } from "@/features/tasks/mock-data";
import { PriorityBadge } from "./PriorityBadge";
import { AssigneeAvatar } from "./AssigneeAvatar";
import { MessageSquare, Paperclip, Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
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
        <h4 className="text-sm font-medium text-text-primary leading-snug pr-2">{task.title}</h4>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <PriorityBadge priority={task.priority} />
        <span className="bg-background text-text-secondary border border-border px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
          {task.storyPoints} SP
        </span>
      </div>
      
      <div className="flex items-center justify-between text-text-secondary mt-auto pt-1">
        <div className="flex items-center gap-3">
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-medium">
              <MessageSquare className="w-3.5 h-3.5" />
              {task.comments.length}
            </div>
          )}
          <div className="flex items-center gap-1 text-[11px] font-medium" title="Due Date">
            <Calendar className="w-3.5 h-3.5" />
            {task.dueDate}
          </div>
        </div>
        <AssigneeAvatar initials={task.assigneeAvatar} name={task.assignee} />
      </div>
    </div>
  );
}
