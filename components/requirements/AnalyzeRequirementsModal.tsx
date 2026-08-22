import { useState } from "react";
import { X, Loader2, Sparkles, Check, XCircle, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalyzeRequirements, useUpdateRequirement, useCreateRequirement, useDeleteRequirement } from "@/features/requirements/hooks/useRequirements";

interface AnalyzeModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function AnalyzeRequirementsModal({ isOpen, onClose, projectId }: AnalyzeModalProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string>("");
  
  const { mutate: analyze, isPending: isAnalyzing } = useAnalyzeRequirements();
  const { mutate: updateReq } = useUpdateRequirement();
  const { mutate: createReq } = useCreateRequirement();
  const { mutate: deleteReq } = useDeleteRequirement();
  
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const handleAnalyze = () => {
    setError("");
    setAnalysis(null);
    setCompletedActions(new Set());
    analyze(projectId, {
      onSuccess: (data) => setAnalysis(data),
      onError: (err: any) => setError(err.message || "Failed to analyze requirements")
    });
  };

  const markActionCompleted = (key: string) => {
    setCompletedActions(prev => new Set(prev).add(key));
  };

  const applyUpdate = (reqId: string, data: any, key: string) => {
    updateReq({ id: reqId, data, projectId }, { onSuccess: () => markActionCompleted(key) });
  };

  const applyCreate = (data: any, key: string) => {
    createReq({ ...data, project_id: projectId }, { onSuccess: () => markActionCompleted(key) });
  };
  
  const applyDelete = (reqId: string, key: string) => {
    deleteReq({ id: reqId, projectId }, { onSuccess: () => markActionCompleted(key) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border w-full max-w-4xl rounded-lg shadow-xl z-10 overflow-hidden flex flex-col h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Requirement Analysis
          </h2>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-background/30">
          {!analysis && !isAnalyzing && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">Analyze Project Requirements</h3>
              <p className="text-text-secondary mb-6">
                AI will review your current requirements for duplicates, missing items, ambiguities, conflicts, dependencies, and risks.
              </p>
              <button 
                onClick={handleAnalyze}
                className="px-6 py-3 bg-primary text-surface rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start Analysis
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-full text-text-secondary">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Analyzing requirements...</p>
              <p className="text-xs opacity-70 mt-2">This may take a minute depending on project size.</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <XCircle className="w-12 h-12 text-error mb-4" />
              <p className="text-error mb-4">{error}</p>
              <button 
                onClick={handleAnalyze}
                className="px-4 py-2 bg-background border border-border text-text-primary rounded-md font-medium hover:bg-surface transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {analysis && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-text-primary">Analysis Results</h3>
                <button 
                  onClick={handleAnalyze}
                  className="px-3 py-1.5 bg-background border border-border text-xs font-medium text-text-primary rounded hover:bg-surface"
                >
                  Re-analyze
                </button>
              </div>

              {/* Duplicates */}
              {analysis.duplicates?.length > 0 && (
                <section>
                  <h4 className="font-semibold text-error mb-3 border-b border-border pb-1">Duplicates</h4>
                  <div className="space-y-4">
                    {analysis.duplicates.filter((item: any) => item != null).map((item: any, i: number) => {
                      const key = `dup-${i}`;
                      const isCompleted = completedActions.has(key);
                      const ids = item.requirement_ids || [];
                      return (
                        <div key={key} className={`p-4 bg-surface border border-border rounded-lg ${isCompleted ? 'opacity-50' : ''}`}>
                          <p className="text-sm text-text-primary mb-2"><span className="font-medium">IDs:</span> {ids.join(', ') || 'N/A'}</p>
                          <p className="text-sm text-text-secondary mb-2"><span className="font-medium text-text-primary">Reason:</span> {item.reason || 'N/A'}</p>
                          <p className="text-sm text-text-secondary mb-4"><span className="font-medium text-text-primary">Action:</span> {item.suggested_action || 'N/A'}</p>
                          {!isCompleted && ids.length >= 2 && (
                            <div className="flex gap-2">
                              {/* For duplicates, automatic resolution is complex. We offer generic dismiss or delete first */}
                              <button onClick={() => applyDelete(ids[1], key)} className="text-xs px-3 py-1 bg-error/10 text-error rounded hover:bg-error/20 flex items-center gap-1"><Check className="w-3 h-3"/> Delete 2nd</button>
                              <button onClick={() => markActionCompleted(key)} className="text-xs px-3 py-1 bg-background border border-border text-text-secondary rounded hover:bg-surface flex items-center gap-1"><X className="w-3 h-3"/> Ignore</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Missing Requirements */}
              {analysis.missing_requirements?.length > 0 && (
                <section>
                  <h4 className="font-semibold text-warning mb-3 border-b border-border pb-1">Missing Requirements</h4>
                  <div className="space-y-4">
                    {analysis.missing_requirements.filter((item: any) => item != null).map((item: any, i: number) => {
                      const key = `miss-${i}`;
                      const isCompleted = completedActions.has(key);
                      return (
                        <div key={key} className={`p-4 bg-surface border border-border rounded-lg ${isCompleted ? 'opacity-50' : ''}`}>
                          <p className="text-sm font-medium text-text-primary mb-1">{item.title || 'Untitled'}</p>
                          <p className="text-sm text-text-secondary mb-2">{item.description || 'No description'}</p>
                          <p className="text-xs bg-background inline-block px-2 py-0.5 rounded border border-border text-text-secondary mb-4">{item.category || 'Uncategorized'}</p>
                          {!isCompleted && (
                            <div className="flex gap-2">
                              <button onClick={() => applyCreate({ title: item.title || 'Untitled', description: item.description || '', category: item.category || '', priority: 'Medium', status: 'Draft' }, key)} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 flex items-center gap-1"><Check className="w-3 h-3"/> Accept & Create</button>
                              <button onClick={() => markActionCompleted(key)} className="text-xs px-3 py-1 bg-background border border-border text-text-secondary rounded hover:bg-surface flex items-center gap-1"><X className="w-3 h-3"/> Reject</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Missing Acceptance Criteria */}
              {analysis.missing_acceptance_criteria?.length > 0 && (
                <section>
                  <h4 className="font-semibold text-primary mb-3 border-b border-border pb-1">Missing Acceptance Criteria</h4>
                  <div className="space-y-4">
                    {analysis.missing_acceptance_criteria.filter((item: any) => item != null).map((item: any, i: number) => {
                      const key = `ac-${i}`;
                      const isCompleted = completedActions.has(key);
                      return (
                        <div key={key} className={`p-4 bg-surface border border-border rounded-lg ${isCompleted ? 'opacity-50' : ''}`}>
                          <p className="text-sm text-text-secondary mb-2"><span className="font-medium text-text-primary">Req ID:</span> {item.requirement_id || 'N/A'}</p>
                          <div className="bg-background p-3 rounded border border-border text-sm font-mono text-text-secondary mb-4 whitespace-pre-wrap">
                            {item.suggested_criteria || 'No criteria suggested'}
                          </div>
                          {!isCompleted && item.requirement_id && (
                            <div className="flex gap-2">
                              <button onClick={() => applyUpdate(item.requirement_id, { acceptance_criteria: item.suggested_criteria }, key)} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 flex items-center gap-1"><Check className="w-3 h-3"/> Apply to Req</button>
                              <button onClick={() => markActionCompleted(key)} className="text-xs px-3 py-1 bg-background border border-border text-text-secondary rounded hover:bg-surface flex items-center gap-1"><X className="w-3 h-3"/> Reject</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Priority Suggestions */}
              {analysis.priority_suggestions?.length > 0 && (
                <section>
                  <h4 className="font-semibold text-info mb-3 border-b border-border pb-1">Priority Suggestions</h4>
                  <div className="space-y-4">
                    {analysis.priority_suggestions.filter((item: any) => item != null).map((item: any, i: number) => {
                      const key = `pri-${i}`;
                      const isCompleted = completedActions.has(key);
                      return (
                        <div key={key} className={`p-4 bg-surface border border-border rounded-lg ${isCompleted ? 'opacity-50' : ''}`}>
                          <p className="text-sm text-text-secondary mb-2"><span className="font-medium text-text-primary">Req ID:</span> {item.requirement_id || 'N/A'}</p>
                          <p className="text-sm text-text-primary mb-2">Change from <span className="font-mono bg-background px-1 rounded border border-border">{item.current_priority || '—'}</span> to <span className="font-mono bg-primary/10 text-primary px-1 rounded">{item.suggested_priority || '—'}</span></p>
                          <p className="text-sm text-text-secondary mb-4"><span className="font-medium text-text-primary">Reason:</span> {item.reason || 'N/A'}</p>
                          {!isCompleted && item.requirement_id && (
                            <div className="flex gap-2">
                              <button onClick={() => applyUpdate(item.requirement_id, { priority: item.suggested_priority }, key)} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 flex items-center gap-1"><Check className="w-3 h-3"/> Apply</button>
                              <button onClick={() => markActionCompleted(key)} className="text-xs px-3 py-1 bg-background border border-border text-text-secondary rounded hover:bg-surface flex items-center gap-1"><X className="w-3 h-3"/> Reject</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Ambiguous, Conflicts, Dependencies, Risks - Advisory display only */}
              {['ambiguous_requirements', 'conflicts', 'dependencies', 'risks'].map(cat => {
                if (!analysis[cat] || analysis[cat].length === 0) return null;
                return (
                  <section key={cat}>
                    <h4 className="font-semibold text-text-primary capitalize mb-3 border-b border-border pb-1">{cat.replace('_', ' ')}</h4>
                    <div className="space-y-4">
                      {analysis[cat].filter((item: any) => item != null).map((item: any, i: number) => (
                        <div key={i} className="p-4 bg-surface border border-border rounded-lg">
                          <pre className="text-xs text-text-secondary whitespace-pre-wrap font-sans">{JSON.stringify(item, null, 2)}</pre>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
