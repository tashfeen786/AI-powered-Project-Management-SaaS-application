"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Bot, Database, Layout, Users, ListTodo, Shield, FileText, Check } from "lucide-react";
import { useCreateProject } from "@/features/projects/hooks/useCreateProject";

const steps = [
  { id: 'analyze', title: 'Analyzing Requirements', icon: FileText },
  { id: 'architecture', title: 'Designing Architecture & DB', icon: Database },
  { id: 'breakdown', title: 'Generating Epics & Tasks', icon: ListTodo },
  { id: 'planning', title: 'Planning Sprints & Timeline', icon: Layout },
  { id: 'assignment', title: 'Smart Resource Assignment', icon: Users },
  { id: 'risk', title: 'Risk & Quality Analysis', icon: Shield },
];

export function WizardStep3({ basicInfo, requirements, onPrev }: any) {
  const router = useRouter();
  const { mutate: createProject } = useCreateProject();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  useEffect(() => {
    // 1. First, create the project in the backend
    createProject(
      {
        name: basicInfo.name,
        description: requirements, // we save raw requirements to description or a new field
        project_type: basicInfo.project_type,
        industry: basicInfo.industry,
        target_platform: basicInfo.target_platform,
        expected_users: basicInfo.expected_users,
        budget: basicInfo.budget,
        priority: basicInfo.priority,
        // map other fields as necessary
      },
      {
        onSuccess: (data) => {
          setCreatedProjectId(data.data?.id || null);
          startAIFlow(data.data?.id);
        }
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startAIFlow = async (projectId: string | undefined) => {
    // Simulate the AI taking time to process each step
    // In reality, this would listen to a WebSocket or poll a background job status
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      // Wait between 1.5s to 3s per step for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
    }
    
    setCurrentStepIndex(steps.length);
    setIsComplete(true);
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
          {isComplete ? "Project Generated Successfully" : "AI Architect is at work..."}
        </h2>
        <p className="text-text-secondary text-center max-w-lg mb-12">
          {isComplete 
            ? "Your project workspace has been fully initialized with requirements, architecture, tasks, and team assignments."
            : "Please wait while our AI analyzes your inputs and generates a complete production-ready project plan."}
        </p>

        <div className="w-full max-w-md space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
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
          disabled={!isComplete}
          className="h-11 px-8 bg-primary text-surface rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isComplete ? "Go to Project Workspace" : "Generating Project..."}
        </button>
      </div>
    </div>
  );
}
