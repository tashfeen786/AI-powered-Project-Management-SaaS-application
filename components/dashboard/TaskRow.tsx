import { PriorityBadge } from "./PriorityBadge";
import { CheckCircle2, Circle } from "lucide-react";

interface TaskRowProps {
  task: {
    title: string;
    project: string;
    priority: string;
    status: string;
    dueDate: string;
    assignee: string;
  };
}

export function TaskRow({ task }: TaskRowProps) {
  const isDone = task.status === "Done";
  
  return (
    <button className="w-full flex items-center gap-4 p-3 hover:bg-background border-b border-border last:border-0 transition-colors duration-150 text-left group">
      <div className="text-border group-hover:text-primary transition-colors">
        {isDone ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Circle className="w-4 h-4" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDone ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
          {task.title}
        </p>
        <p className="text-xs text-text-secondary truncate mt-0.5">{task.project}</p>
      </div>
      
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <PriorityBadge priority={task.priority} />
        <span className="text-xs text-text-secondary w-16 text-right">{task.dueDate}</span>
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
          {task.assignee}
        </div>
      </div>
    </button>
  );
}
