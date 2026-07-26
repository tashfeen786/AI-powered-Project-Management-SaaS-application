"use client";

import { use, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { WorkspaceHeader } from "@/components/requirements/WorkspaceHeader";
import { ConversationPanel } from "@/components/requirements/ConversationPanel";
import { DraftPanel } from "@/components/requirements/DraftPanel";
import { ApproveModal } from "@/components/requirements/ApproveModal";
import { useConversation } from "@/features/requirements/hooks/useConversation";
import { useDraft } from "@/features/requirements/hooks/useDraft";
import { RequirementsService } from "@/services/requirements.service";
import { Message, SRSData } from "@/features/requirements/mock-data";
import { Loader2 } from "lucide-react";

export default function RequirementsWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const { data: initialMessages, isLoading: isMessagesLoading } = useConversation(resolvedParams.id);
  const { data: initialDraft, isLoading: isDraftLoading } = useDraft(resolvedParams.id);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState<SRSData | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [approvalStatus, setApprovalStatus] = useState<"idle" | "generating" | "success">("idle");

  useEffect(() => {
    if (initialMessages) setMessages(initialMessages);
    if (initialDraft) setDraft(initialDraft);
  }, [initialMessages, initialDraft]);

  const handleSendMessage = async (text: string) => {
    // Optimistic UI for user message
    const userMsg: Message = { id: Math.random().toString(), role: 'user', content: text, timestamp: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = { id: Math.random().toString(), role: 'ai', content: "I'm analyzing your request and updating the draft now.", timestamp: 'Just now' };
      setMessages(prev => [...prev, aiMsg]);
      setIsAiTyping(false);
      
      // Simulate draft update
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

  const handleUpdateSection = async (id: string, content: string) => {
    if (!draft) return;
    setIsSaving(true);
    // Optimistic update
    setDraft(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map(s => s.id === id ? { ...s, content } : s)
      };
    });
    
    await RequirementsService.updateDraft(resolvedParams.id, id, content);
    setIsSaving(false);
  };

  const handleApprove = async () => {
    if (draft?.aiStatus !== 'Ready') return;
    setApprovalStatus("generating");
    await RequirementsService.approveDraft(resolvedParams.id);
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
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
            <span>Dashboard</span>
            <span className="opacity-50">/</span>
            <span>Projects</span>
            <span className="opacity-50">/</span>
            <span className="text-primary">Requirements</span>
          </div>
          <WorkspaceHeader aiStatus={draft.aiStatus} onApprove={handleApprove} />
        </div>
        
        {/* Main Split Layout */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 pb-4">
          
          {/* Left Panel: Conversation (45%) */}
          <div className="flex-1 md:w-[45%] md:flex-none flex flex-col min-h-0">
            <ConversationPanel 
              messages={messages} 
              documents={draft.documents} 
              onSendMessage={handleSendMessage} 
              isTyping={isAiTyping} 
            />
          </div>
          
          {/* Right Panel: Live Draft (55%) */}
          <div className="flex-1 md:w-[55%] md:flex-none flex flex-col min-h-0">
            <DraftPanel 
              draft={draft} 
              isSaving={isSaving} 
              onUpdateSection={handleUpdateSection} 
            />
          </div>
          
        </div>
      </div>

      <ApproveModal 
        isOpen={approvalStatus !== "idle"} 
        status={approvalStatus} 
        onClose={() => setApprovalStatus("idle")} 
      />
    </AppLayout>
  );
}
