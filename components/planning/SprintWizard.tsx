import { useState, useEffect } from "react";
import { SprintResponse } from "@/types/api";
import { useCreateSprint, useUpdateSprint, useGenerateSprintPlan } from "@/features/sprints/hooks/useSprints";
import { X, Loader2, Sparkles, ChevronRight, ChevronLeft, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SprintWizardProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingSprint: SprintResponse | null;
}

export function SprintWizard({ isOpen, onClose, projectId, existingSprint }: SprintWizardProps) {
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    duration: 2,
    velocity: 40,
    team_members: "", // Comma separated for UI simplicity
    capacity: 0,
    story_points: 0,
    start_date: "",
    end_date: "",
    ai_generated_plan: "",
    timeline_suggestion: "",
    risks_suggestion: "",
  });

  useEffect(() => {
    if (existingSprint) {
      setFormData({
        name: existingSprint.name || "",
        goal: existingSprint.goal || "",
        duration: existingSprint.duration || 2,
        velocity: existingSprint.velocity || 40,
        team_members: (existingSprint.team_members || []).join(", "),
        capacity: existingSprint.capacity || 0,
        story_points: existingSprint.story_points || 0,
        start_date: existingSprint.start_date || "",
        end_date: existingSprint.end_date || "",
        ai_generated_plan: existingSprint.ai_generated_plan || "",
        timeline_suggestion: existingSprint.timeline_suggestion || "",
        risks_suggestion: existingSprint.risks_suggestion || "",
      });
      // If editing an existing sprint that already has an AI plan, jump to step 2 or stay on step 1?
      setStep(1);
    } else {
      setFormData({
        name: "Sprint 1",
        goal: "",
        duration: 2,
        velocity: 40,
        team_members: "",
        capacity: 0,
        story_points: 0,
        start_date: "",
        end_date: "",
        ai_generated_plan: "",
        timeline_suggestion: "",
        risks_suggestion: "",
      });
      setStep(1);
    }
  }, [existingSprint, isOpen]);

  const { mutate: createSprint, isPending: isCreating } = useCreateSprint();
  const { mutate: updateSprint, isPending: isUpdating } = useUpdateSprint();
  const { mutate: generatePlan, isPending: isGenerating } = useGenerateSprintPlan();

  const isSaving = isCreating || isUpdating;

  const handleGenerate = () => {
    if (!formData.name || !formData.goal) {
      alert("Please enter a Sprint Name and Goal first.");
      return;
    }

    generatePlan({
      projectId,
      data: {
        project_id: projectId,
        sprint_goal: formData.goal,
        duration: formData.duration,
        team_members: formData.team_members.split(",").map(m => m.trim()).filter(Boolean),
        velocity: formData.velocity
      }
    }, {
      onSuccess: (data) => {
        setFormData(prev => ({
          ...prev,
          ai_generated_plan: data.ai_generated_plan || "",
          timeline_suggestion: data.timeline_suggestion || "",
          risks_suggestion: data.risks_suggestion || "",
          story_points: data.suggested_story_points || prev.story_points
        }));
        setStep(2);
      },
      onError: (err) => {
        alert("Failed to generate plan: " + err.message);
      }
    });
  };

  const handleSave = (status: "Draft" | "Planned" = "Planned") => {
    const payload = {
      ...formData,
      status: existingSprint?.status !== "Draft" && existingSprint?.status !== "Planned" ? existingSprint?.status : status,
      team_members: formData.team_members.split(",").map(m => m.trim()).filter(Boolean)
    };

    if (existingSprint) {
      updateSprint({ id: existingSprint.id, projectId, data: payload }, {
        onSuccess: () => onClose()
      });
    } else {
      createSprint({ ...payload, project_id: projectId }, {
        onSuccess: () => onClose()
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border w-full max-w-4xl rounded-lg shadow-xl z-10 overflow-hidden flex flex-col max-h-[95vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-text-primary">
              {existingSprint ? "Edit Sprint Plan" : "Sprint Planning Wizard"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className={`h-1.5 w-12 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
              <div className={`h-1.5 w-12 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary rounded-md focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Sprint Name <span className="text-error">*</span></label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary"
                        placeholder="e.g. Sprint 1 - MVP Setup"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Sprint Goal <span className="text-error">*</span></label>
                      <textarea 
                        value={formData.goal}
                        onChange={e => setFormData({...formData, goal: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary resize-none"
                        placeholder="What do we want to achieve in this sprint?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Team Members (comma separated)</label>
                      <input 
                        type="text" 
                        value={formData.team_members}
                        onChange={e => setFormData({...formData, team_members: e.target.value})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary"
                        placeholder="Alice, Bob, Charlie"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Duration (Weeks)</label>
                        <input 
                          type="number" 
                          value={formData.duration}
                          onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary"
                          min={1} max={12}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Team Velocity</label>
                        <input 
                          type="number" 
                          value={formData.velocity}
                          onChange={e => setFormData({...formData, velocity: Number(e.target.value)})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Start Date</label>
                        <input 
                          type="date" 
                          value={formData.start_date}
                          onChange={e => setFormData({...formData, start_date: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">End Date</label>
                        <input 
                          type="date" 
                          value={formData.end_date}
                          onChange={e => setFormData({...formData, end_date: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary"
                        />
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-2">
                      <div className="flex gap-3">
                        <Sparkles className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary mb-1">AI Copilot</h4>
                          <p className="text-xs text-text-secondary mb-3">
                            Let AI break down your sprint goal into actionable tasks, estimate story points, and identify risks.
                          </p>
                          <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating || !formData.name || !formData.goal}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-surface rounded text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                          >
                            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                            Generate AI Sprint Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-text-primary">AI Sprint Plan Overview</h3>
                  <div className="text-sm font-medium bg-surface border border-border px-3 py-1 rounded-full">
                    Est. Story Points: <span className="text-primary">{formData.story_points}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Execution Plan</label>
                    <textarea 
                      value={formData.ai_generated_plan}
                      onChange={e => setFormData({...formData, ai_generated_plan: e.target.value})}
                      rows={5}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Suggested Timeline</label>
                      <textarea 
                        value={formData.timeline_suggestion}
                        onChange={e => setFormData({...formData, timeline_suggestion: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Risk Mitigations</label>
                      <textarea 
                        value={formData.risks_suggestion}
                        onChange={e => setFormData({...formData, risks_suggestion: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary resize-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-4 border-t border-border bg-background/50 flex justify-between shrink-0">
          {step === 2 ? (
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSaving || isGenerating}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
            >
              Cancel
            </button>
          )}

          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => handleSave("Draft")}
              disabled={isSaving || isGenerating || !formData.name}
              className="px-4 py-2 bg-surface border border-border text-text-primary rounded-md text-sm font-medium hover:bg-background transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button 
              type="button" 
              onClick={() => {
                if (step === 1 && formData.ai_generated_plan) {
                  setStep(2);
                } else {
                  handleSave("Planned");
                }
              }}
              disabled={isSaving || isGenerating || !formData.name}
              className="px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : step === 1 && formData.ai_generated_plan ? (
                <>Next <ChevronRight className="w-4 h-4" /></>
              ) : (
                <><Save className="w-4 h-4" /> Save Sprint Plan</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
