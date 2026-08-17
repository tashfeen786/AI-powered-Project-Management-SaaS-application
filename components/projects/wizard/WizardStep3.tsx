"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, CheckCircle2, Bot, Database, Layout, Users, ListTodo, 
  Shield, FileText, Check, AlertTriangle, Layers, Code2, Clock, 
  ChevronDown, ChevronRight, XCircle, RotateCcw
} from "lucide-react";
import { useCreateProject } from "@/features/projects/hooks/useCreateProject";
import { ProjectService } from "@/services/project.service";

interface AnalysisResult {
  modules?: Array<{ name: string; description: string; priority: string; estimated_effort_days: number }>;
  features?: Array<{ name: string; module: string; description: string; priority: string; complexity: string }>;
  missing_requirements?: Array<{ area: string; description: string; severity: string }>;
  ambiguous_requirements?: Array<{ requirement: string; issue: string; suggestion: string }>;
  suggested_priorities?: Array<{ phase: string; modules: string[]; rationale: string }>;
  timeline_estimation?: { total_estimated_weeks: number; phases: Array<{ name: string; duration_weeks: number; key_deliverables: string[] }> };
  database_entities?: Array<{ name: string; description: string; key_fields: string[]; relationships: string[] }>;
  api_requirements?: Array<{ endpoint_group: string; endpoints: string[]; description: string }>;
  architecture_recommendations?: { pattern: string; tech_stack: Record<string, string>; key_decisions: string[]; scalability_notes: string };
  execution_recommendations?: Array<{ category: string; recommendation: string; priority: string }>;
  raw_response?: string;
  parse_error?: string;
}

type WizardPhase = "idle" | "creating" | "analyzing" | "complete" | "error";

export function WizardStep3({ basicInfo, requirements, onPrev }: any) {
  const router = useRouter();
  const { mutateAsync: createProjectAsync } = useCreateProject();
  
  const [phase, setPhase] = useState<WizardPhase>("idle");
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorPhase, setErrorPhase] = useState<"creation" | "analysis" | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    modules: true, features: false, missing: false, ambiguous: false,
    priorities: false, timeline: false, database: false, api: false,
    architecture: true, execution: false
  });
  const startedRef = useRef(false);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const priorityColor = (p: string) => {
    switch (p?.toLowerCase()) {
      case "high": case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": case "important": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": case "nice-to-have": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  // Run AI analysis on a project that already exists
  const runAnalysis = useCallback(async (projectId: string) => {
    setPhase("analyzing");
    setErrorMsg(null);
    setErrorPhase(null);
    
    try {
      const result = await ProjectService.analyzeProject(projectId, requirements);
      const analysis = (result as any)?.data?.analysis || (result as any)?.analysis;
      if (analysis) {
        setAnalysisResult(analysis);
      }
      setPhase("complete");
    } catch (err: any) {
      const msg = err?.message || err?.data?.detail || "Failed to analyze requirements";
      setErrorMsg(msg);
      setErrorPhase("analysis");
      setPhase("error");
    }
  }, [requirements]);

  // Create project + run analysis (only runs once)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    setPhase("creating");

    const initializeProject = async () => {
      try {
        const data = await createProjectAsync({
          name: basicInfo.name,
          description: requirements,
          project_type: basicInfo.project_type,
          industry: basicInfo.industry,
          target_platform: basicInfo.target_platform,
          expected_users: basicInfo.expected_users,
          budget: basicInfo.budget,
          priority: basicInfo.priority,
          tech_preferences: basicInfo.tech_preferences
        });

        const projectId = data.id || (data as any).data?.id;
        
        if (!projectId || projectId === "undefined") {
          throw new Error("Project created but no valid Project ID was returned from the server.");
        }

        setCreatedProjectId(projectId);
        setPhase("analyzing");
      } catch (err: any) {
        const msg = err?.message || err?.data?.detail || "Failed to create project";
        setErrorMsg(msg);
        setErrorPhase("creation");
        setPhase("error");
      }
    };

    initializeProject();
  }, []);

  // Effect to trigger analysis once the phase transitions to "analyzing"
  useEffect(() => {
    if (phase === "analyzing" && createdProjectId) {
      runAnalysis(createdProjectId);
    }
  }, [phase, createdProjectId, runAnalysis]);

  const handleRetryAnalysis = () => {
    if (createdProjectId) {
      runAnalysis(createdProjectId);
    }
  };

  const handleFinish = () => {
    if (createdProjectId) {
      router.push(`/projects/${createdProjectId}`);
    } else {
      router.push("/projects");
    }
  };

  // Section component
  const Section = ({ id, title, icon: Icon, count, children }: { id: string; title: string; icon: any; count?: number; children: React.ReactNode }) => (
    <div className="border border-border rounded-lg overflow-hidden mb-3">
      <button 
        onClick={() => toggleSection(id)}
        className="w-full flex items-center gap-3 p-4 bg-surface hover:bg-background transition-colors text-left"
      >
        <Icon className="w-5 h-5 text-primary shrink-0" />
        <span className="flex-1 font-semibold text-text-primary">{title}</span>
        {count !== undefined && (
          <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">{count}</span>
        )}
        {expandedSections[id] ? <ChevronDown className="w-4 h-4 text-text-secondary" /> : <ChevronRight className="w-4 h-4 text-text-secondary" />}
      </button>
      {expandedSections[id] && (
        <div className="p-4 bg-background border-t border-border">
          {children}
        </div>
      )}
    </div>
  );

  // Loading state
  if (phase === "creating" || phase === "analyzing") {
    return (
      <div className="flex flex-col h-full bg-background overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center min-h-[500px]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Bot className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-2 text-center">
            {phase === "creating" ? "Creating Project..." : "AI Architect is analyzing..."}
          </h2>
          <p className="text-text-secondary text-center max-w-lg mb-8">
            {phase === "creating" 
              ? "Setting up your project workspace..."
              : "Analyzing your requirements with Groq AI to generate a structured project plan. This may take 15-30 seconds."}
          </p>
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <div className={`w-2 h-2 rounded-full ${phase === "creating" ? "bg-primary animate-pulse" : "bg-green-500"}`} />
              <span>Project Creation</span>
              <div className={`w-2 h-2 rounded-full ${phase === "analyzing" ? "bg-primary animate-pulse" : "bg-gray-500"}`} />
              <span>AI Analysis</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (phase === "error") {
    return (
      <div className="flex flex-col h-full bg-background overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center min-h-[500px]">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-2 text-center">
            {errorPhase === "creation" ? "Project Creation Failed" : "Analysis Failed"}
          </h2>
          <p className="text-red-400 text-center max-w-lg mb-8 font-mono text-sm bg-red-500/5 p-4 rounded-lg border border-red-500/20">
            {errorMsg}
          </p>
          {createdProjectId && (
            <p className="text-text-secondary text-sm mb-4">
              Project was created successfully (ID: {createdProjectId.slice(0, 8)}...)
            </p>
          )}
        </div>
        <div className="p-4 border-t border-border bg-surface flex justify-center gap-4">
          <button onClick={onPrev} className="h-11 px-6 bg-transparent border border-border text-text-primary rounded-lg font-medium hover:bg-background transition-colors">
            Back
          </button>
          {errorPhase === "analysis" && createdProjectId && (
            <button 
              onClick={handleRetryAnalysis} 
              className="h-11 px-6 bg-primary/10 border border-primary/30 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Analysis
            </button>
          )}
          <button onClick={handleFinish} className="h-11 px-8 bg-primary text-surface rounded-lg font-medium hover:opacity-90 transition-opacity">
            {createdProjectId ? "Go to Project" : "Go to Projects"}
          </button>
        </div>
      </div>
    );
  }

  // Success / Results state
  const a = analysisResult;
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-8 max-w-5xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Requirements Analysis Complete</h2>
            <p className="text-text-secondary text-sm">AI has analyzed your requirements and generated a structured project plan.</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{a?.modules?.length || 0}</div>
            <div className="text-xs text-text-secondary mt-1">Modules</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{a?.features?.length || 0}</div>
            <div className="text-xs text-text-secondary mt-1">Features</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{a?.database_entities?.length || 0}</div>
            <div className="text-xs text-text-secondary mt-1">DB Entities</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{a?.timeline_estimation?.total_estimated_weeks || '—'}</div>
            <div className="text-xs text-text-secondary mt-1">Est. Weeks</div>
          </div>
        </div>

        {/* Sections */}
        {a?.modules && a.modules.length > 0 && (
          <Section id="modules" title="Project Modules" icon={Layers} count={a.modules.length}>
            <div className="grid gap-3">
              {a.modules.map((m, i) => (
                <div key={i} className="flex items-start gap-3 bg-surface p-3 rounded-lg border border-border">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-primary">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-text-primary">{m.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${priorityColor(m.priority)}`}>{m.priority}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{m.description}</p>
                    {m.estimated_effort_days && (
                      <span className="text-xs text-text-secondary mt-1 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> ~{m.estimated_effort_days} days</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {a?.features && a.features.length > 0 && (
          <Section id="features" title="Features" icon={ListTodo} count={a.features.length}>
            <div className="grid gap-2">
              {a.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-surface p-3 rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary text-sm">{f.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${priorityColor(f.priority)}`}>{f.priority}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-text-secondary">{f.complexity}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{f.module} — {f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {a?.missing_requirements && a.missing_requirements.length > 0 && (
          <Section id="missing" title="Missing Requirements" icon={AlertTriangle} count={a.missing_requirements.length}>
            <div className="grid gap-2">
              {a.missing_requirements.map((m, i) => (
                <div key={i} className="bg-surface p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary text-sm">{m.area}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${priorityColor(m.severity)}`}>{m.severity}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{m.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {a?.ambiguous_requirements && a.ambiguous_requirements.length > 0 && (
          <Section id="ambiguous" title="Ambiguous Requirements" icon={AlertTriangle} count={a.ambiguous_requirements.length}>
            <div className="grid gap-2">
              {a.ambiguous_requirements.map((ar, i) => (
                <div key={i} className="bg-surface p-3 rounded-lg border border-border">
                  <p className="text-sm font-medium text-text-primary mb-1">"{ar.requirement}"</p>
                  <p className="text-xs text-yellow-400 mb-1">Issue: {ar.issue}</p>
                  <p className="text-xs text-green-400">Suggestion: {ar.suggestion}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {a?.suggested_priorities && a.suggested_priorities.length > 0 && (
          <Section id="priorities" title="Suggested Priorities" icon={Shield} count={a.suggested_priorities.length}>
            <div className="grid gap-2">
              {a.suggested_priorities.map((sp, i) => (
                <div key={i} className="bg-surface p-3 rounded-lg border border-border">
                  <div className="font-semibold text-text-primary text-sm mb-1">{sp.phase}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {sp.modules.map((m, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">{m}</span>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary">{sp.rationale}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {a?.timeline_estimation && (
          <Section id="timeline" title="Timeline Estimation" icon={Clock}>
            <div className="mb-4 text-sm text-text-primary">
              Total estimated: <span className="font-bold text-primary">{a.timeline_estimation.total_estimated_weeks} weeks</span>
            </div>
            <div className="grid gap-2">
              {a.timeline_estimation.phases?.map((p, i) => (
                <div key={i} className="bg-surface p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-text-primary text-sm">{p.name}</span>
                    <span className="text-xs text-primary font-medium">{p.duration_weeks} weeks</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.key_deliverables?.map((d, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 bg-surface border border-border text-text-secondary rounded-full">{d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {a?.database_entities && a.database_entities.length > 0 && (
          <Section id="database" title="Database Entities" icon={Database} count={a.database_entities.length}>
            <div className="grid gap-2">
              {a.database_entities.map((e, i) => (
                <div key={i} className="bg-surface p-3 rounded-lg border border-border">
                  <div className="font-semibold text-text-primary text-sm mb-1">{e.name}</div>
                  <p className="text-xs text-text-secondary mb-2">{e.description}</p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {e.key_fields?.map((f, j) => (
                      <span key={j} className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded font-mono">{f}</span>
                    ))}
                  </div>
                  {e.relationships?.length > 0 && (
                    <div className="text-[10px] text-text-secondary mt-1">
                      {e.relationships.join(" | ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {a?.api_requirements && a.api_requirements.length > 0 && (
          <Section id="api" title="API Requirements" icon={Code2} count={a.api_requirements.length}>
            <div className="grid gap-2">
              {a.api_requirements.map((ar, i) => (
                <div key={i} className="bg-surface p-3 rounded-lg border border-border">
                  <div className="font-semibold text-text-primary text-sm mb-1">{ar.endpoint_group}</div>
                  <p className="text-xs text-text-secondary mb-2">{ar.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {ar.endpoints?.map((ep, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 bg-surface border border-border text-text-secondary rounded font-mono">{ep}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {a?.architecture_recommendations && (
          <Section id="architecture" title="Architecture Recommendations" icon={Layout}>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-text-primary mb-1">Pattern</div>
                <div className="text-sm text-primary font-semibold">{a.architecture_recommendations.pattern}</div>
              </div>
              {a.architecture_recommendations.tech_stack && (
                <div>
                  <div className="text-sm font-medium text-text-primary mb-2">Tech Stack</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(a.architecture_recommendations.tech_stack).map(([key, val]) => (
                      <div key={key} className="bg-surface p-2 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider">{key.replace('_', ' ')}</div>
                        <div className="text-sm text-text-primary font-medium">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {a.architecture_recommendations.key_decisions?.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-text-primary mb-1">Key Decisions</div>
                  <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                    {a.architecture_recommendations.key_decisions.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {a.architecture_recommendations.scalability_notes && (
                <div>
                  <div className="text-sm font-medium text-text-primary mb-1">Scalability Notes</div>
                  <p className="text-sm text-text-secondary">{a.architecture_recommendations.scalability_notes}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {a?.execution_recommendations && a.execution_recommendations.length > 0 && (
          <Section id="execution" title="Execution Recommendations" icon={Shield} count={a.execution_recommendations.length}>
            <div className="grid gap-2">
              {a.execution_recommendations.map((er, i) => (
                <div key={i} className="flex items-start gap-3 bg-surface p-3 rounded-lg border border-border">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 mt-0.5 ${priorityColor(er.priority)}`}>{er.priority}</span>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{er.category}</div>
                    <p className="text-xs text-text-secondary">{er.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      <div className="p-4 border-t border-border bg-surface flex justify-center">
        <button 
          onClick={handleFinish}
          className="h-11 px-8 bg-primary text-surface rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          Go to Project Workspace
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
