import { AiStatusBadge } from "./AiStatusBadge";
import { AiStatus } from "@/features/requirements/mock-data";
import { Check, Download, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { GenerateRequirementModal } from "./GenerateRequirementModal";

interface WorkspaceHeaderProps {
  aiStatus: AiStatus;
  onApprove: () => void;
  projectId: string;
}

export function WorkspaceHeader({ aiStatus, onApprove, projectId }: WorkspaceHeaderProps) {
  const canApprove = aiStatus === 'Ready';
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateTitle, setGenerateTitle] = useState("");

  const handleExport = (format: 'pdf' | 'docx') => {
    // Since PDF/DOCX libraries aren't installed, we export as TXT mimicking the format
    const content = `Software Requirements Specification (SRS)\n\nStatus: ${aiStatus}\nExport Format: ${format.toUpperCase()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SRS-Export.${format === 'pdf' ? 'txt' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAiActionClick = (title: string) => {
    setGenerateTitle(title);
    setIsAiMenuOpen(false);
    setIsGenerateModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-text-primary">Requirements</h1>
          <AiStatusBadge status={aiStatus} />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
              className="h-9 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              AI Actions
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            
            {isAiMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsAiMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-64 bg-surface border border-border rounded-md shadow-lg z-50 py-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Generate</div>
                  <button onClick={() => handleAiActionClick("Complete SRS")} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> SRS Document
                  </button>
                  <button onClick={() => handleAiActionClick("Functional Requirements")} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Functional Requirements
                  </button>
                  <button onClick={() => handleAiActionClick("Non Functional Requirements")} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Non-Functional Requirements
                  </button>
                  <button onClick={() => handleAiActionClick("User Stories")} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> User Stories
                  </button>
                  <button onClick={() => handleAiActionClick("Acceptance Criteria")} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Acceptance Criteria
                  </button>
                  <button onClick={() => handleAiActionClick("Use Cases")} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Use Cases
                  </button>
                </div>
              </>
            )}
          </div>
          
          <button 
            onClick={() => handleExport('pdf')}
            className="h-9 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 bg-surface border border-border text-text-primary hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button 
            onClick={() => handleExport('docx')}
            className="h-9 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 bg-surface border border-border text-text-primary hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            DOCX
          </button>
          <button 
            disabled={!canApprove}
            onClick={onApprove}
            className={cn(
              "h-9 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0",
              canApprove ? "bg-primary text-surface hover:opacity-90 shadow-sm hover:-translate-y-0.5" : "bg-surface border border-border text-text-secondary opacity-50 cursor-not-allowed"
            )}
          >
            <Check className="w-4 h-4" />
            Approve SRS
          </button>
        </div>
      </div>

      <GenerateRequirementModal 
        isOpen={isGenerateModalOpen} 
        onClose={() => setIsGenerateModalOpen(false)} 
        projectId={projectId} 
        initialTitle={generateTitle}
      />
    </>
  );
}
