"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useUpdateTask } from "@/features/tasks/hooks/useUpdateTask";
import { TaskStatus, TaskPriority, TaskResponse } from "@/types/api";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskResponse;
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<TaskStatus>(task.status as TaskStatus);
  const [priority, setPriority] = useState<TaskPriority>(task.priority as TaskPriority);
  const [storyPoints, setStoryPoints] = useState(task.story_points || 0);
  const [dueDate, setDueDate] = useState(task.due_date || "");
  
  const { mutate, isPending } = useUpdateTask(task.project_id);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status as TaskStatus);
    setPriority(task.priority as TaskPriority);
    setStoryPoints(task.story_points || 0);
    setDueDate(task.due_date || "");
  }, [task]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    mutate(
      { 
        taskId: task.id, 
        title, 
        description, 
        status, 
        priority,
        story_points: storyPoints,
        due_date: dueDate || undefined
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Edit Task</h2>
            <button
              onClick={onClose}
              className="p-1 text-text-secondary hover:text-text-primary rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] p-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Backlog">Backlog</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Story Points</label>
                <input
                  type="number"
                  value={storyPoints}
                  onChange={(e) => setStoryPoints(parseInt(e.target.value) || 0)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 bg-transparent border border-border text-text-primary rounded-md text-sm font-medium hover:bg-background transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !title.trim()}
                className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
