"use client";

import { use, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { WorkspaceHeader } from "@/components/planning/WorkspaceHeader";
import { ConversationPanel } from "@/components/requirements/ConversationPanel";
import { PlanningPanel } from "@/components/planning/PlanningPanel";
import { ApproveModal } from "@/components/requirements/ApproveModal";
import { usePlanningConversation } from "@/features/planning/hooks/usePlanningConversation";
import { usePlanningDraft } from "@/features/planning/hooks/usePlanningDraft";
import { PlanningService } from "@/services/planning.service";
import { Message } from "@/features/requirements/mock-data";
import { PlanningData } from "@/features/planning/mock-data";
import { Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PlanningWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const { data: initialMessages, isLoading: isMessagesLoading } = usePlanningConversation(resolvedParams.id);
  const { data: initialDraft, isLoading: isDraftLoading } = usePlanningDraft(resolvedParams.id);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState<PlanningData | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [approvalStatus, setApprovalStatus] = useState<"idle" | "generating" | "success">("idle");

  useEffect(() => {
    if (initialMessages) setMessages(initialMessages as any);
    if (initialDraft) setDraft(initialDraft);
  }, [initialMessages, initialDraft]);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { id: Math.random().toString(), role: 'user', content: text, timestamp: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);
    
    setTimeout(() => {
      const aiMsg: Message = { id: Math.random().toString(), role: 'ai', content: "I'm updating the sprint plan based on your feedback.", timestamp: 'Just now' };
      setMessages(prev => [...prev, aiMsg]);
      setIsAiTyping(false);
      
      if (draft) {
        setIsSaving(true);
        setTimeout(() => {
          setDraft(prev => prev ? { ...prev, aiStatus: 'Updating Draft' } : prev);
          setTimeout(() => {
            setDraft(prev => prev ? { ...prev, aiStatus: 'Ready', lastSaved: 'Just now' } : prev);
            setIsSaving(false);
          }, 1500);
        }, 500);
      }
    }, 1200);
  };

  const handleApprove = async () => {
    if (draft?.aiStatus !== 'Ready') return;
    setApprovalStatus("generating");
    await PlanningService.approvePlan(resolvedParams.id);
    setApprovalStatus("success");
  };

  if (isMessagesLoading || isDraftLoading || !draft) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-[calc(100vh-112px)] flex flex-col max-w-[1600px] mx-auto w-full px-2 sm:px-4">
        
        {/* Header */}
        <div className="shrink-0 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`/projects/${resolvedParams.id}`} 
              className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Back to Project
            </Link>
          </div>
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
            <span>Dashboard</span>
            <span className="opacity-50">/</span>
            <span>Projects</span>
            <span className="opacity-50">/</span>
            <span>Planning</span>
          </div>
          <WorkspaceHeader aiStatus={draft.aiStatus} onApprove={handleApprove} />
        </div>
        
        {/* Main Split Layout */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 pb-4">
          
          <div className="flex-1 md:w-[45%] md:flex-none flex flex-col min-h-0">
            <ConversationPanel 
              messages={messages} 
              documents={[]} 
              onSendMessage={handleSendMessage} 
              isTyping={isAiTyping} 
            />
          </div>
          
          <div className="flex-1 md:w-[55%] md:flex-none flex flex-col min-h-0">
            <PlanningPanel 
              draft={draft} 
              isSaving={isSaving} 
            />
          </div>
          
        </div>
      </div>

      <ApproveModal 
        isOpen={approvalStatus !== "idle"} 
        status={approvalStatus} 
        onClose={() => setApprovalStatus("idle")} 
        successTitle="Plan Approved!"
        successMessage="The sprint plan is locked and ready for execution."
        buttonText="View Kanban Board"
      />
    </AppLayout>
  );
}
