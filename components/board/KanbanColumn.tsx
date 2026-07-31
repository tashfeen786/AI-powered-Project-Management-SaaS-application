import { TaskResponse, TaskStatus } from "@/types/api";
import { TaskCard } from "./TaskCard";
import { EmptyColumn } from "./EmptyColumn";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  title: TaskStatus;
  tasks: TaskResponse[];
  onTaskClick: (task: TaskResponse) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  isDragOver: boolean;
}

export function KanbanColumn({ 
  title, 
  tasks, 
  onTaskClick, 
  onDragStart, 
  onDragOver, 
  onDrop,
  isDragOver 
}: KanbanColumnProps) {
  
  return (
    <div 
      className={cn(
        "flex-1 min-w-[280px] max-w-[350px] flex flex-col bg-background rounded-lg border transition-colors",
        isDragOver ? "border-primary bg-primary/5" : "border-border"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, title)}
    >
      <div className="p-3 border-b border-border flex justify-between items-center bg-surface rounded-t-lg">
        <h3 className="font-semibold text-sm text-text-primary uppercase tracking-wider">{title}</h3>
        <span className="bg-background border border-border text-text-secondary text-xs font-bold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <EmptyColumn />
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick} 
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
