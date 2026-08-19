"use client";

import { use } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import { BoardHeader } from "@/components/board/BoardHeader";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { BoardSkeleton } from "@/components/board/BoardSkeleton";
import { CreateTaskModal } from "@/components/board/CreateTaskModal";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useUpdateTask } from "@/features/tasks/hooks/useUpdateTask";
import { TaskStatus } from "@/types/api";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCollaboration } from "@/features/collaboration/hooks/useCollaboration";

// Minimal Toast Implementation for optimistic failure UI
function Toast({ message, show }: { message: string, show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-surface border border-border shadow-lg rounded-lg px-4 py-3 text-sm font-medium text-text-primary z-50 flex items-center gap-2 animate-in slide-in-from-bottom-5">
      <div className="w-2 h-2 rounded-full bg-danger"></div>
      {message}
    </div>
  );
}

export default function KanbanBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const { data: tasks, isLoading } = useTasks(projectId);
  const { mutate: updateTask } = useUpdateTask(projectId);
  const [toastMessage, setToastMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    search: "",
    assigneeId: "",
    priority: "",
    phase: "",
    isAiGenerated: false
  });
  
  const queryClient = useQueryClient();
  
  // Connect to WS and listen for updates
  const { onlineUsers } = useCollaboration(projectId, (event, payload) => {
    const refreshEvents = [
      "task_updated", 
      "new_comment", 
      "reaction_added", 
      "reaction_removed", 
      "attachment_uploaded",
      "watcher_added",
      "watcher_removed"
    ];
    if (refreshEvents.includes(event)) {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    }
  });

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    updateTask(
      { taskId, status },
      {
        onError: () => {
          setToastMessage("Failed to update task. Changes reverted.");
          setTimeout(() => setToastMessage(""), 3000);
        }
      }
    );
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-64px)] flex flex-col max-w-[1600px] mx-auto w-full px-2 sm:px-4 pb-4">
        
        <div className="shrink-0 mb-4 pt-4">
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-2">
            <span>Dashboard</span>
            <span className="opacity-50">/</span>
            <span>Projects</span>
            <span className="opacity-50">/</span>
            <span>Project {projectId}</span>
            <span className="opacity-50">/</span>
            <span className="text-primary">Board</span>
          </div>
        </div>
        
        <ProjectTabs projectId={projectId}>
          <BoardHeader 
            onCreateClick={() => setIsCreateModalOpen(true)} 
            filters={filters}
            setFilters={setFilters}
          />
          
          <div className="flex-1 min-h-[600px] relative mt-6">
            {isLoading ? (
              <BoardSkeleton />
            ) : !tasks?.items || tasks.items.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-surface border border-dashed border-border rounded-lg">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-2">No tasks found</h2>
                <p className="text-sm text-text-secondary max-w-sm mb-6">
                  Generate a Sprint Plan first or create a task manually to populate your board.
                </p>
              </div>
            ) : (
              <KanbanBoard 
                tasks={(tasks.items as any).filter((task: any) => {
                  if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && !task.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
                  if (filters.assigneeId === "unassigned" && task.assignee_id) return false;
                  if (filters.assigneeId && filters.assigneeId !== "unassigned" && task.assignee_id !== filters.assigneeId) return false;
                  if (filters.priority && task.priority !== filters.priority) return false;
                  if (filters.phase && task.phase !== filters.phase) return false;
                  if (filters.isAiGenerated && !task.phase && (!task.requirement_ids || task.requirement_ids.length === 0)) return false;
                  return true;
                })} 
                onUpdateTaskStatus={handleUpdateTaskStatus} 
              />
            )}
          </div>
        </ProjectTabs>
        
        <Toast message={toastMessage} show={!!toastMessage} />
        <CreateTaskModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          projectId={projectId} 
        />
      </div>
    </AppLayout>
  );
}
