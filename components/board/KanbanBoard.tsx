"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/features/tasks/mock-data";
import { KanbanColumn } from "./KanbanColumn";
import { TaskDetailDrawer } from "./TaskDetailDrawer";

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

export function KanbanBoard({ tasks, onUpdateTaskStatus }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const columns: TaskStatus[] = ["To Do", "In Progress", "Review", "Done"];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== status) {
        onUpdateTaskStatus(taskId, status);
      }
    }
  };

  return (
    <>
      <div className="flex gap-4 h-full overflow-x-auto pb-4 custom-scrollbar items-start">
        {columns.map(status => (
          <KanbanColumn
            key={status}
            title={status}
            tasks={tasks.filter(t => t.status === status)}
            onTaskClick={setSelectedTask}
            onDragStart={handleDragStart}
            onDragOver={(e) => handleDragOver(e, status)}
            onDrop={handleDrop}
            isDragOver={dragOverColumn === status}
          />
        ))}
      </div>

      <TaskDetailDrawer 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </>
  );
}
