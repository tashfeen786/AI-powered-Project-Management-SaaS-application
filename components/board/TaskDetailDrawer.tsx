"use client";

import { TaskResponse } from "@/types/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlignLeft, Activity, MessageSquare } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { AssigneeAvatar } from "./AssigneeAvatar";
import { TaskComments } from "./TaskComments";
import { TaskActivity } from "./TaskActivity";
import { TaskAssigneeSection } from "./TaskAssigneeSection";

interface TaskDetailDrawerProps {
  task: TaskResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (taskId: string) => void;
  onEdit?: () => void;
}

export function TaskDetailDrawer({ task, isOpen, onClose, onDelete, onEdit }: TaskDetailDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && task && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-text-primary/10 backdrop-blur-[1px] z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {task.id.toUpperCase()}
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button 
                    onClick={onEdit}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors focus:outline-none text-xs font-semibold"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 text-danger hover:bg-danger/10 rounded transition-colors focus:outline-none text-xs font-semibold"
                  >
                    Delete
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-xl font-bold text-text-primary mb-6 leading-tight">{task.title}</h2>
              
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8 bg-background border border-border rounded-lg p-4">
                <div>
                  <div className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Status</div>
                  <StatusBadge status={task.status} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Priority</div>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Assignee</div>
                  <TaskAssigneeSection task={task} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Sprint</div>
                  <span className="text-sm font-medium text-text-primary">{task.sprint_id ? "Current Sprint" : "Backlog"}</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Estimate</div>
                  <span className="text-sm font-medium text-text-primary">{task.story_points || 0} SP ({task.estimated_hours || 0}h)</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Due Date</div>
                  <span className="text-sm font-medium text-text-primary">{task.due_date || "No date"}</span>
                </div>
                {task.phase && (
                  <div className="col-span-2 mt-2">
                    <div className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Phase</div>
                    <span className="text-sm font-medium text-text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{task.phase}</span>
                  </div>
                )}
                {task.requirement_ids && task.requirement_ids.length > 0 && (
                  <div className="col-span-2 mt-2">
                    <div className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Requirements Linked</div>
                    <div className="flex flex-wrap gap-2">
                      {task.requirement_ids.map(id => (
                        <span key={id} className="text-xs font-medium text-text-secondary bg-background border border-border px-2 py-1 rounded">
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-text-secondary" />
                  Description
                </h3>
                <div className="text-sm text-text-secondary leading-relaxed p-4 bg-background border border-border rounded-lg min-h-[100px]">
                  {task.description || "No description provided."}
                </div>
              </div>

              {/* Comments */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-text-secondary" />
                  Comments
                </h3>
                <TaskComments comments={task.comments || []} projectId={task.project_id} taskId={task.id} />
              </div>

              {/* Activity */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-text-secondary" />
                  Activity
                </h3>
                <TaskActivity activity={task.activities || []} />
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-background">
              <button 
                onClick={onClose}
                className="w-full h-9 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
