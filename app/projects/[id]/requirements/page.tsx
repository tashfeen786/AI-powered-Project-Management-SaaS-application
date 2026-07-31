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
import { Loader2 } from "lucide-react";

export default function RequirementsWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const { data: initialMessages, isLoading: isMessagesLoading } = useConversation(resolvedParams.id);
  const { data: initialDraft, isLoading: isDraftLoading } = useDraft(resolvedParams.id);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState<any>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [approvalStatus, setApprovalStatus] = useState<"idle" | "generating" | "success">("idle");

  useEffect(() => {
    if (initialMessages) setMessages(initialMessages as any);
    if (initialDraft) {
      setDraft({ 
        ...((initialDraft.generated_content as any) || {}), 
        aiStatus: initialDraft.status === 'approved' ? 'Ready' : 'Draft',
        lastSaved: initialDraft.updated_at
      });
    }
  }, [initialMessages, initialDraft]);

  const handleSendMessage = async (text: string) => {
    // Optimistic UI for user message
    const userMsg = { id: Math.random().toString(), role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);
    
    try {
      // In a real app, this would call a chat endpoint that updates the draft
      // For now, we simulate the AI response by updating the draft directly via the existing service
      setIsSaving(true);
      setDraft((prev: any) => prev ? { ...prev, aiStatus: 'Updating Draft' } : prev);
      
      const updatedDraft = await RequirementsService.updateRequirement(initialDraft!.id, {
        generated_content: { ...draft, _lastMessage: text } as any
      });
      
      setDraft({
        ...(updatedDraft.generated_content || {}),
        aiStatus: 'Ready',
        lastSaved: updatedDraft.updated_at
      });
      
      const aiMsg = { id: Math.random().toString(), role: 'ai', content: "I've updated the draft based on your request.", timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Failed to update requirements", error);
    } finally {
      setIsAiTyping(false);
      setIsSaving(false);
    }
  };

  const handleUpdateSection = async (id: string, content: string) => {
    if (!draft) return;
    setIsSaving(true);
    // Optimistic update
    setDraft((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s: any) => s.id === id ? { ...s, content } : s)
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
              documents={draft?.documents || []} 
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
