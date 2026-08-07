"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Bot, Database, Layout, Users, ListTodo, Shield, FileText, Check } from "lucide-react";
import { useCreateProject } from "@/features/projects/hooks/useCreateProject";
import { useCollaboration } from "@/features/collaboration/hooks/useCollaboration";
import { ProjectService } from "@/services/project.service";

const steps = [
  { id: 'pipeline_started', title: 'Analyzing Requirements', icon: FileText },
  { id: 'requirements_parsed', title: 'Designing Architecture & DB', icon: Database },
  { id: 'planning_generated', title: 'Generating Epics & Tasks', icon: ListTodo },
  { id: 'tasks_generated', title: 'Smart Resource Assignment', icon: Users },
  { id: 'assignments_completed', title: 'Risk & Quality Analysis', icon: Shield },
  { id: 'pipeline_finished', title: 'Pipeline Complete', icon: CheckCircle2 },
];

export function WizardStep3({ basicInfo, requirements, onPrev }: any) {
  const router = useRouter();
  const { mutate: createProject } = useCreateProject();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set up WebSocket listener
  useCollaboration(createdProjectId || undefined, (event, payload) => {
    console.log("Wizard Received WS Event:", event, payload);
    const stepIndex = steps.findIndex(s => s.id === event);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      if (event === "pipeline_finished") {
        setIsComplete(true);
      }
    } else if (event === "pipeline_failed") {
      setErrorMsg(payload?.error || "AI Pipeline failed");
    }
  });

  useEffect(() => {
    // 1. First, create the project in the backend
    createProject(
      {
        name: basicInfo.name,
        description: requirements, // Raw requirements
        project_type: basicInfo.project_type,
        industry: basicInfo.industry,
        target_platform: basicInfo.target_platform,
        expected_users: basicInfo.expected_users,
        budget: basicInfo.budget,
        priority: basicInfo.priority,
        tech_preferences: basicInfo.tech_preferences
      },
      {
        onSuccess: async (data: any) => {
          const projectId = data.id || data.data?.id; // depending on interceptor
          setCreatedProjectId(projectId);
          // Wait briefly for WebSocket connection to establish
          setTimeout(() => {
            startAIFlow(projectId);
          }, 1000);
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to create project");
        }
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startAIFlow = async (projectId: string) => {
    try {
      await ProjectService.analyzeProject(projectId, requirements);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to start AI analysis");
    }
  };

  const handleFinish = () => {
    if (createdProjectId) {
      router.push(`/projects/${createdProjectId}`);
    } else {
      router.push("/projects");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-8 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center min-h-[500px]">
        
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Bot className="w-10 h-10 text-primary" />
        </div>
        
        <h2 className="text-3xl font-bold text-text-primary mb-2 text-center">
          {errorMsg ? "Generation Failed" : isComplete ? "Project Generated Successfully" : "AI Architect is at work..."}
        </h2>
        <p className="text-text-secondary text-center max-w-lg mb-12">
          {errorMsg
            ? <span className="text-red-500">{errorMsg}</span>
            : isComplete 
              ? "Your project workspace has been fully initialized with requirements, architecture, tasks, and team assignments."
              : "Please wait while our AI analyzes your inputs and generates a complete production-ready project plan. This might take a couple of minutes."}
        </p>

        <div className="w-full max-w-md space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex && !isComplete && !errorMsg;
            const isDone = index < currentStepIndex || isComplete;

            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  isActive ? "border-primary bg-primary/5" : 
                  isDone ? "border-border bg-surface opacity-70" : 
                  "border-transparent opacity-40"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isDone ? "bg-green-500/20 text-green-500" :
                  isActive ? "bg-primary text-surface" :
                  "bg-surface text-text-secondary"
                }`}>
                  {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 font-medium text-text-primary">
                  {step.title}
                </div>
                
                {isActive && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                {isDone && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-border bg-surface flex justify-center">
        <button 
          onClick={handleFinish}
          disabled={!isComplete && !errorMsg}
          className="h-11 px-8 bg-primary text-surface rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isComplete || errorMsg ? "Go to Project Workspace" : "Generating Project..."}
        </button>
      </div>
    </div>
  );
}
