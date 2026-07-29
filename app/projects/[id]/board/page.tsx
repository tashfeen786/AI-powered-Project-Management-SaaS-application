"use client";

import { use } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BoardHeader } from "@/components/board/BoardHeader";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { BoardSkeleton } from "@/components/board/BoardSkeleton";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useUpdateTask } from "@/features/tasks/hooks/useUpdateTask";
import { TaskStatus } from "@/types/api";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
        
        {/* Breadcrumb Navigation */}
        <div className="shrink-0 mb-4 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`/projects/${projectId}`} 
              className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Back to Project
            </Link>
          </div>
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span>Dashboard</span>
            <span className="opacity-50">/</span>
            <span>Projects</span>
            <span className="opacity-50">/</span>
            <span>Project {projectId}</span>
            <span className="opacity-50">/</span>
            <span className="text-primary">Board</span>
          </div>
        </div>
        
        <BoardHeader />
        
        <div className="flex-1 min-h-0 relative">
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
            <KanbanBoard tasks={tasks.items as any} onUpdateTaskStatus={handleUpdateTaskStatus} />
          )}
        </div>
        
        <Toast message={toastMessage} show={!!toastMessage} />
      </div>
    </AppLayout>
  );
}
