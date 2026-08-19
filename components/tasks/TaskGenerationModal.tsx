import { useState, useEffect } from "react";
import { TaskGenerationService } from "@/services/task-generation.service";
import { Loader2, X, Sparkles, Check, Edit2, AlertCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  planningId: string;
}

export function TaskGenerationModal({ isOpen, onClose, projectId, planningId }: TaskGenerationModalProps) {
  const [generation, setGeneration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState("");
  
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<any>(null);

  const fetchGeneration = async () => {
    setIsLoading(true);
    try {
      const generations = await TaskGenerationService.getGenerations(projectId);
      const pendingGen = generations.find(g => g.status === "Pending");
      if (pendingGen) {
        setGeneration(pendingGen);
      } else {
        setGeneration(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGeneration();
    }
  }, [isOpen, projectId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const result = await TaskGenerationService.generateTasks(projectId, { planning_id: planningId });
      setGeneration(result);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to generate tasks");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!generation) return;
    setIsApproving(true);
    try {
      await TaskGenerationService.approveGeneration(generation.id);
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to approve tasks");
    } finally {
      setIsApproving(false);
    }
  };
  
  const handleEditTask = (index: number) => {
    setEditingTaskIndex(index);
    setEditedTask({ ...generation.generated_tasks.tasks[index] });
  };
  
  const handleSaveTask = async () => {
    if (editingTaskIndex === null || !generation) return;
    const newTasks = [...generation.generated_tasks.tasks];
    newTasks[editingTaskIndex] = editedTask;
    
    const newPayload = { tasks: newTasks };
    
    try {
      await TaskGenerationService.updateGeneration(generation.id, newPayload);
      setGeneration({ ...generation, generated_tasks: newPayload });
      setEditingTaskIndex(null);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to save task");
    }
  };

  if (!isOpen) return null;

  const tasks = generation?.generated_tasks?.tasks || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border w-full max-w-5xl rounded-lg shadow-xl z-10 overflow-hidden flex flex-col h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Task Generation
            </h2>
            <p className="text-sm text-text-secondary">Generate and review actionable tasks based on the approved project plan.</p>
          </div>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary rounded-md focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-text-secondary">AI is generating tasks based on requirements and phases...</p>
            </div>
          ) : !generation ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Sparkles className="w-16 h-16 text-primary/40 mb-4" />
              <h3 className="text-xl font-medium text-text-primary mb-2">Ready to Generate Tasks</h3>
              <p className="text-text-secondary mb-6 text-center max-w-md">
                The AI will analyze the approved 5-phase plan and requirements to generate actionable Kanban tasks.
              </p>
              {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3 w-full max-w-md">
                  <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}
              <button 
                onClick={handleGenerate}
                className="px-6 py-3 bg-primary text-surface rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Tasks Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-text-primary text-lg">Generated Tasks ({tasks.length})</h3>
              </div>

              {tasks.map((task: any, index: number) => {
                const isEditing = editingTaskIndex === index;
                
                return (
                  <div key={index} className="bg-surface rounded-lg border border-border p-4 shadow-sm">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Title</label>
                          <input 
                            type="text" 
                            value={editedTask.title}
                            onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                            className="w-full px-3 py-2 bg-background border border-border rounded text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Description</label>
                          <textarea 
                            value={editedTask.description}
                            onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 bg-background border border-border rounded text-sm resize-none"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-text-secondary mb-1">Phase</label>
                            <input 
                              type="text" 
                              value={editedTask.phase}
                              onChange={(e) => setEditedTask({...editedTask, phase: e.target.value})}
                              className="w-full px-3 py-1.5 bg-background border border-border rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-text-secondary mb-1">Priority</label>
                            <select 
                              value={editedTask.priority}
                              onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
                              className="w-full px-3 py-1.5 bg-background border border-border rounded text-sm"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                              <option value="Critical">Critical</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-text-secondary mb-1">Story Points</label>
                            <input 
                              type="number" 
                              value={editedTask.story_points}
                              onChange={(e) => setEditedTask({...editedTask, story_points: Number(e.target.value)})}
                              className="w-full px-3 py-1.5 bg-background border border-border rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-text-secondary mb-1">Est. Hours</label>
                            <input 
                              type="number" 
                              value={editedTask.estimated_hours}
                              onChange={(e) => setEditedTask({...editedTask, estimated_hours: Number(e.target.value)})}
                              className="w-full px-3 py-1.5 bg-background border border-border rounded text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Acceptance Criteria (one per line)</label>
                          <textarea 
                            value={(editedTask.acceptance_criteria || []).join('\n')}
                            onChange={(e) => setEditedTask({...editedTask, acceptance_criteria: e.target.value.split('\n').filter(Boolean)})}
                            rows={3}
                            className="w-full px-3 py-2 bg-background border border-border rounded text-sm resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Dependencies (one per line)</label>
                          <textarea 
                            value={(editedTask.dependencies || []).join('\n')}
                            onChange={(e) => setEditedTask({...editedTask, dependencies: e.target.value.split('\n').filter(Boolean)})}
                            rows={2}
                            className="w-full px-3 py-2 bg-background border border-border rounded text-sm resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Requirement IDs (comma separated)</label>
                          <input 
                            type="text" 
                            value={(editedTask.requirement_ids || []).join(', ')}
                            onChange={(e) => setEditedTask({...editedTask, requirement_ids: e.target.value.split(',').map((id: string) => id.trim()).filter(Boolean)})}
                            className="w-full px-3 py-1.5 bg-background border border-border rounded text-sm font-mono"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button onClick={() => setEditingTaskIndex(null)} className="px-4 py-2 text-sm text-text-secondary hover:bg-background rounded border border-border">Cancel</button>
                          <button onClick={handleSaveTask} className="px-4 py-2 text-sm bg-primary text-surface rounded flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save Task
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-base font-semibold text-text-primary">{task.title}</h4>
                          <button onClick={() => handleEditTask(index)} className="p-1.5 text-text-secondary hover:text-text-primary rounded hover:bg-background">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">{task.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          <div className="bg-background px-3 py-2 rounded border border-border flex flex-col">
                            <span className="text-[10px] text-text-secondary uppercase">Phase</span>
                            <span className="text-sm font-medium truncate" title={task.phase}>{task.phase}</span>
                          </div>
                          <div className="bg-background px-3 py-2 rounded border border-border flex flex-col">
                            <span className="text-[10px] text-text-secondary uppercase">Priority</span>
                            <span className="text-sm font-medium">{task.priority}</span>
                          </div>
                          <div className="bg-background px-3 py-2 rounded border border-border flex flex-col">
                            <span className="text-[10px] text-text-secondary uppercase">Points</span>
                            <span className="text-sm font-medium">{task.story_points}</span>
                          </div>
                          <div className="bg-background px-3 py-2 rounded border border-border flex flex-col">
                            <span className="text-[10px] text-text-secondary uppercase">Est. Hours</span>
                            <span className="text-sm font-medium">{task.estimated_hours}</span>
                          </div>
                        </div>

                        {task.acceptance_criteria?.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs font-semibold text-text-secondary uppercase">Acceptance Criteria</span>
                            <ul className="list-disc pl-4 mt-1 text-sm text-text-secondary space-y-0.5">
                              {task.acceptance_criteria.map((c: string, i: number) => <li key={i}>{c}</li>)}
                            </ul>
                          </div>
                        )}

                        {task.dependencies?.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs font-semibold text-text-secondary uppercase">Dependencies</span>
                            <ul className="list-disc pl-4 mt-1 text-sm text-text-secondary space-y-0.5">
                              {task.dependencies.map((d: string, i: number) => <li key={i}>{d}</li>)}
                            </ul>
                          </div>
                        )}

                        <div className="mt-3 pt-3 border-t border-border">
                          <span className="text-xs font-semibold text-text-secondary uppercase mb-1 block">Linked Requirements</span>
                          <div className="flex flex-wrap gap-1.5">
                            {task.requirement_ids?.map((reqId: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 bg-background border border-border rounded text-[11px] text-text-secondary font-mono truncate max-w-[200px]" title={reqId}>
                                {reqId}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border bg-background/50 flex justify-between items-center shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
          >
            Close
          </button>

          {generation && !isGenerating && (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGenerate}
                disabled={isApproving}
                className="px-4 py-2 bg-surface border border-border text-text-primary rounded-md text-sm font-medium hover:bg-background transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Regenerate
              </button>
              <button 
                onClick={handleApprove}
                disabled={isApproving || editingTaskIndex !== null}
                className="px-4 py-2 bg-success text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} 
                Approve & Materialize Tasks
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
