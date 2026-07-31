"use client";

import { useState } from "react";
import { useDeleteTask } from "@/features/tasks/hooks/useDeleteTask";
import { TaskResponse, TaskStatus } from "@/types/api";
import { KanbanColumn } from "./KanbanColumn";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { EditTaskModal } from "./EditTaskModal";

interface KanbanBoardProps {
  tasks: TaskResponse[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

export function KanbanBoard({ tasks, onUpdateTaskStatus }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const projectId = tasks[0]?.project_id || ""; // Safe fallback
  const { mutate: deleteTask } = useDeleteTask(projectId);

  const handleDelete = (taskId: string) => {
    deleteTask(taskId, {
      onSuccess: () => {
        if (selectedTask?.id === taskId) {
          setSelectedTask(null);
        }
      }
    });
  };

  const columns: TaskStatus[] = ["Backlog", "Todo", "In Progress", "Review", "Done"];

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
        onDelete={handleDelete}
        onEdit={() => setIsEditModalOpen(true)}
      />
      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={selectedTask}
        />
      )}
    </>
  );
}
