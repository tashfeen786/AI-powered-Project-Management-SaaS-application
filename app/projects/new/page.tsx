"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { WizardStep1 } from "@/components/projects/wizard/WizardStep1";
import { WizardStep2 } from "@/components/projects/wizard/WizardStep2";
import { WizardStep3 } from "@/components/projects/wizard/WizardStep3";
import { useCreateProject } from "@/features/projects/hooks/useCreateProject";
import { ChevronRight, ArrowLeft } from "lucide-react";

export default function NewProjectWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { mutate: createProject, isPending } = useCreateProject();
  
  // Step 1 State
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    project_type: "",
    industry: "",
    target_platform: "",
    expected_users: "",
    budget: "",
    deadline: "",
    priority: "Medium",
    tech_preferences: ""
  });

  // Step 2 State
  const [requirements, setRequirements] = useState("");

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinish = () => {
    // Actually the project can be created earlier, or at the end.
    // Let's create it at the end of Step 1 or Step 2.
    // If Step 3 is AI Analysis, it should probably be done on the created project.
    // For now, let's just trigger create here for simplicity.
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full pb-12 flex flex-col h-[calc(100vh-80px)]">
        <div className="mb-6 flex items-center gap-4 pt-4">
          <button 
            onClick={() => router.push("/projects")}
            className="p-2 hover:bg-surface border border-transparent hover:border-border rounded-md text-text-secondary transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Create New Project</h1>
            <p className="text-text-secondary text-sm">Follow the wizard to set up your AI-managed project.</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8 bg-surface p-4 rounded-lg border border-border">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold border-2 transition-colors ${
                currentStep >= step 
                  ? "bg-primary border-primary text-surface" 
                  : "border-border text-text-secondary bg-background"
              }`}>
                {step}
              </div>
              <div className="ml-3 font-medium text-sm">
                {step === 1 && <span className={currentStep >= 1 ? "text-text-primary" : "text-text-secondary"}>Basic Info</span>}
                {step === 2 && <span className={currentStep >= 2 ? "text-text-primary" : "text-text-secondary"}>Requirements Workspace</span>}
                {step === 3 && <span className={currentStep >= 3 ? "text-text-primary" : "text-text-secondary"}>AI Analysis</span>}
              </div>
              {step < 3 && (
                <div className="flex-1 mx-4 h-px bg-border"></div>
              )}
            </div>
          ))}
        </div>

        {/* Wizard Content */}
        <div className="flex-1 bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
          {currentStep === 1 && (
            <WizardStep1 
              data={basicInfo} 
              onChange={(data) => setBasicInfo(prev => ({ ...prev, ...data }))} 
              onNext={handleNextStep}
            />
          )}
          {currentStep === 2 && (
            <WizardStep2 
              data={requirements}
              onChange={setRequirements}
              onPrev={handlePrevStep}
              onNext={handleNextStep}
              projectData={basicInfo}
            />
          )}
          {currentStep === 3 && (
            <WizardStep3 
              basicInfo={basicInfo}
              requirements={requirements}
              onPrev={handlePrevStep}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
