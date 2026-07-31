"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, Loader2, PlayCircle, MoreVertical, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { useSprints, useDeleteSprint, useUpdateSprint } from "@/features/sprints/hooks/useSprints";
import { SprintWizard } from "./SprintWizard";
import { SprintResponse } from "@/types/api";
import { cn } from "@/lib/utils";

const sprintStatusStyles = {
  Draft: "bg-surface border-border text-text-secondary",
  Planned: "bg-primary/10 border-primary/20 text-primary",
  Active: "bg-success/10 border-success/20 text-success",
  Completed: "bg-background border-border text-text-secondary opacity-50",
};

export function PlanningTab({ projectId }: { projectId: string }) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<SprintResponse | null>(null);

  const { data, isLoading } = useSprints(projectId);
  const { mutate: deleteSprint } = useDeleteSprint();
  const { mutate: updateSprint } = useUpdateSprint();

  const handleStartSprint = (sprint: SprintResponse) => {
    updateSprint({
      id: sprint.id,
      projectId,
      data: { status: "Active" }
    });
  };

  const handleCompleteSprint = (sprint: SprintResponse) => {
    updateSprint({
      id: sprint.id,
      projectId,
      data: { status: "Completed" }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this sprint?")) {
      deleteSprint({ id, projectId });
    }
  };

  const openWizard = (sprint?: SprintResponse) => {
    setEditingSprint(sprint || null);
    setIsWizardOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Sprint Planning</h2>
          <p className="text-sm text-text-secondary">Organize your backlog into actionable sprints with AI.</p>
        </div>
        <button 
          onClick={() => openWizard()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Plan New Sprint
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-text-secondary" />
          </div>
        ) : data?.items?.length ? (
          data.items.map(sprint => (
            <div key={sprint.id} className="bg-surface border border-border rounded-lg p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-medium text-text-primary">{sprint.name}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider inline-flex",
                    sprintStatusStyles[(sprint.status as keyof typeof sprintStatusStyles) || "Draft"] || sprintStatusStyles.Draft
                  )}>
                    {sprint.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{sprint.goal || "No sprint goal defined."}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {sprint.start_date && sprint.end_date 
                      ? `${sprint.start_date} - ${sprint.end_date}`
                      : "Dates TBD"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {sprint.duration ? `${sprint.duration} Weeks` : "TBD"}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-text-primary">
                    {sprint.story_points || 0} pts
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                {sprint.status === "Draft" || sprint.status === "Planned" ? (
                  <button
                    onClick={() => handleStartSprint(sprint)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-background border border-primary/30 text-primary rounded-md text-sm font-medium hover:bg-primary/10 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Start Sprint
                  </button>
                ) : sprint.status === "Active" ? (
                  <button
                    onClick={() => handleCompleteSprint(sprint)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-success/10 border border-success/30 text-success rounded-md text-sm font-medium hover:bg-success/20 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete
                  </button>
                ) : null}

                <div className="relative group">
                  <button className="p-2 text-text-secondary hover:text-text-primary rounded-md focus:outline-none focus:bg-background transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-36 bg-surface border border-border rounded-md shadow-lg z-10 py-1 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity">
                    <button 
                      onClick={() => openWizard(sprint)}
                      className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Details
                    </button>
                    <button 
                      onClick={() => handleDelete(sprint.id)}
                      className="w-full text-left px-3 py-1.5 text-sm text-error hover:bg-error/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-surface border border-border border-dashed rounded-lg p-12 text-center">
            <h3 className="text-lg font-medium text-text-primary mb-2">No Sprints Found</h3>
            <p className="text-sm text-text-secondary mb-4">You haven't planned any sprints for this project yet.</p>
            <button 
              onClick={() => openWizard()}
              className="px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Plan Your First Sprint
            </button>
          </div>
        )}
      </div>

      <SprintWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        projectId={projectId}
        existingSprint={editingSprint}
      />
    </div>
  );
}
