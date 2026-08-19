"use client";

import { use, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import { PlanningService } from "@/services/planning.service";
import { TaskGenerationModal } from "@/components/tasks/TaskGenerationModal";
import { Loader2, Sparkles, Check, Edit2, AlertCircle, ListTodo } from "lucide-react";

export default function PlanningWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const [draft, setDraft] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState("");
  
  const [editingPhaseIndex, setEditingPhaseIndex] = useState<number | null>(null);
  const [editedPhase, setEditedPhase] = useState<any>(null);
  
  const [isTaskGenModalOpen, setIsTaskGenModalOpen] = useState(false);

  const fetchDraft = async () => {
    try {
      const plan = await PlanningService.getDraft(projectId);
      if (plan && plan.planning_content) {
        try {
          const parsed = JSON.parse(plan.planning_content);
          setDraft({ ...plan, parsed_content: parsed });
        } catch (e) {
          setDraft(plan);
        }
      } else {
        setDraft(plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDraft();
  }, [projectId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const result = await PlanningService.generatePlan(projectId);
      if (result && result.planning_content) {
        try {
          const parsed = JSON.parse(result.planning_content);
          setDraft({ ...result, parsed_content: parsed });
        } catch (e) {
          setDraft(result);
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!draft) return;
    setIsApproving(true);
    try {
      await PlanningService.approvePlan(draft.id);
      await fetchDraft();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to approve plan");
    } finally {
      setIsApproving(false);
    }
  };
  
  const handleEditPhase = (index: number) => {
    setEditingPhaseIndex(index);
    setEditedPhase({ ...draft.parsed_content.phases[index] });
  };
  
  const handleSavePhase = async () => {
    if (editingPhaseIndex === null || !draft) return;
    const newPhases = [...draft.parsed_content.phases];
    newPhases[editingPhaseIndex] = editedPhase;
    
    const newParsedContent = { ...draft.parsed_content, phases: newPhases };
    
    try {
      await PlanningService.updatePlan(draft.id, { planning_content: JSON.stringify(newParsedContent) });
      setDraft({ ...draft, parsed_content: newParsedContent });
      setEditingPhaseIndex(null);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to save phase");
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const phases = draft?.parsed_content?.phases || [];

  return (
    <AppLayout>
      <div className="h-[calc(100vh-112px)] flex flex-col max-w-[1200px] mx-auto w-full px-2 sm:px-4 overflow-y-auto">
        
        <div className="shrink-0 mb-4 pt-4">
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
            <span>Dashboard</span>
            <span className="opacity-50">/</span>
            <span>Projects</span>
            <span className="opacity-50">/</span>
            <span>Project {projectId}</span>
            <span className="opacity-50">/</span>
            <span className="text-primary">Planning</span>
          </div>
        </div>

        <ProjectTabs projectId={projectId}>
          <div className="flex flex-col gap-6 mt-6 pb-20">
            <div className="flex justify-between items-center bg-surface p-4 rounded-lg border border-border">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Project Plan</h2>
                <p className="text-sm text-text-secondary">AI-generated 5-phase execution plan based on approved requirements.</p>
              </div>
              <div className="flex items-center gap-3">
                {draft?.status === "Draft" && (
                  <button 
                    onClick={handleApprove}
                    disabled={isApproving || isGenerating || phases.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-success text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve Plan
                  </button>
                )}
                {draft?.status === "Approved" && (
                  <>
                    <button 
                      onClick={() => setIsTaskGenModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <ListTodo className="w-4 h-4" />
                      Generate Tasks
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-md text-sm font-medium border border-success/20">
                      <Check className="w-4 h-4" />
                      Plan Approved
                    </div>
                  </>
                )}
                {draft?.status !== "Approved" && (
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {phases.length > 0 ? "Regenerate Plan" : "Generate AI Plan"}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {!isGenerating && phases.length === 0 && !error && (
              <div className="bg-surface border border-border border-dashed rounded-lg p-12 text-center">
                <Sparkles className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No Plan Generated</h3>
                <p className="text-sm text-text-secondary mb-4 max-w-md mx-auto">
                  Click Generate AI Plan to automatically create a structured 5-phase execution plan based on your approved requirements.
                </p>
                <button 
                  onClick={handleGenerate}
                  className="px-6 py-2.5 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate AI Plan
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-lg border border-border">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-text-secondary">AI is analyzing approved requirements and generating your 5-phase plan...</p>
              </div>
            )}

            {!isGenerating && phases.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-xs text-text-secondary mb-1">Status</p>
                    <p className="text-lg font-semibold text-text-primary">{draft.status}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-xs text-text-secondary mb-1">Total Phases</p>
                    <p className="text-lg font-semibold text-text-primary">{phases.length}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-xs text-text-secondary mb-1">Estimated Hours</p>
                    <p className="text-lg font-semibold text-text-primary">{draft.estimated_hours || 0}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-xs text-text-secondary mb-1">Story Points</p>
                    <p className="text-lg font-semibold text-text-primary">{draft.estimated_story_points || 0}</p>
                  </div>
                </div>

                {phases.map((phase: any, index: number) => {
                  const isEditing = editingPhaseIndex === index;
                  
                  return (
                    <div key={index} className="bg-surface rounded-lg border border-border overflow-hidden">
                      <div className="px-5 py-4 border-b border-border bg-background/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editedPhase.name}
                              onChange={(e) => setEditedPhase({...editedPhase, name: e.target.value})}
                              className="px-2 py-1 bg-background border border-border rounded text-sm font-semibold min-w-[250px]"
                            />
                          ) : (
                            <h3 className="text-base font-semibold text-text-primary">{phase.name}</h3>
                          )}
                        </div>
                        {draft.status === "Draft" && !isEditing && (
                          <button onClick={() => handleEditPhase(index)} className="p-1.5 text-text-secondary hover:text-text-primary rounded hover:bg-background">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {isEditing && (
                          <div className="flex gap-2">
                            <button onClick={() => setEditingPhaseIndex(null)} className="px-3 py-1 text-xs text-text-secondary hover:bg-background rounded border border-border">Cancel</button>
                            <button onClick={handleSavePhase} className="px-3 py-1 text-xs bg-primary text-surface rounded">Save</button>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Objective</h4>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editedPhase.objective}
                              onChange={(e) => setEditedPhase({...editedPhase, objective: e.target.value})}
                              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                            />
                          ) : (
                            <p className="text-sm text-text-primary">{phase.objective}</p>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Description</h4>
                          {isEditing ? (
                            <textarea 
                              value={editedPhase.description}
                              onChange={(e) => setEditedPhase({...editedPhase, description: e.target.value})}
                              rows={3}
                              className="w-full px-3 py-2 bg-background border border-border rounded text-sm resize-none"
                            />
                          ) : (
                            <p className="text-sm text-text-secondary">{phase.description}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          <div className="bg-background p-3 rounded border border-border">
                            <span className="block text-xs text-text-secondary mb-1">Est. Hours</span>
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={editedPhase.estimated_hours}
                                onChange={(e) => setEditedPhase({...editedPhase, estimated_hours: Number(e.target.value)})}
                                className="w-full px-2 py-1 border border-border rounded text-sm"
                              />
                            ) : (
                              <span className="font-semibold text-sm">{phase.estimated_hours}</span>
                            )}
                          </div>
                          <div className="bg-background p-3 rounded border border-border">
                            <span className="block text-xs text-text-secondary mb-1">Story Points</span>
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={editedPhase.story_points}
                                onChange={(e) => setEditedPhase({...editedPhase, story_points: Number(e.target.value)})}
                                className="w-full px-2 py-1 border border-border rounded text-sm"
                              />
                            ) : (
                              <span className="font-semibold text-sm">{phase.story_points}</span>
                            )}
                          </div>
                        </div>

                        {(phase.dependencies?.length > 0 || isEditing) && (
                          <div className="mb-4">
                            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Dependencies</h4>
                            {isEditing ? (
                              <textarea 
                                value={(editedPhase.dependencies || []).join('\n')}
                                onChange={(e) => setEditedPhase({...editedPhase, dependencies: e.target.value.split('\n').filter(Boolean)})}
                                rows={2}
                                className="w-full px-3 py-2 bg-background border border-border rounded text-sm resize-none"
                                placeholder="One dependency per line"
                              />
                            ) : (
                              <ul className="list-disc pl-4 text-sm text-text-secondary space-y-1">
                                {phase.dependencies.map((dep: string, i: number) => <li key={i}>{dep}</li>)}
                              </ul>
                            )}
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Addressed Requirements</h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.requirement_ids?.map((reqId: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-2 py-1 bg-background border border-border rounded text-xs text-text-secondary font-mono truncate max-w-[200px]" title={reqId}>
                                {reqId}
                              </span>
                            ))}
                            {(!phase.requirement_ids || phase.requirement_ids.length === 0) && (
                              <span className="text-xs text-text-secondary italic">None linked</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ProjectTabs>
      </div>

      {draft?.status === "Approved" && (
        <TaskGenerationModal 
          isOpen={isTaskGenModalOpen} 
          onClose={() => setIsTaskGenModalOpen(false)} 
          projectId={projectId} 
          planningId={draft.id} 
        />
      )}
    </AppLayout>
  );
}
