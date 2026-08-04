"use client";

import { use, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import { ChatLayout } from "@/components/copilot/ChatLayout";
import { ConversationSidebar } from "@/components/copilot/ConversationSidebar";
import { ChatWindow } from "@/components/copilot/ChatWindow";
import { CopilotSkeleton } from "@/components/copilot/CopilotSkeleton";
import { useCopilot } from "@/features/copilot/hooks/useCopilot";
import { useConversation, useSendMessage } from "@/features/copilot/hooks/useConversation";
import { CopilotService } from "@/services/copilot.service";
import Link from "next/link";
import { ChevronLeft, MessageSquare } from "lucide-react";

export default function ProjectCopilotPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const { data: conversations, isLoading: isLoadingSidebar, refetch: refetchSidebar } = useCopilot(projectId);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Set the first conversation as active if none is selected
  useEffect(() => {
    if (!activeId && conversations && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);
  
  const { data: messages, isLoading: isLoadingMessages } = useConversation(activeId);
  const { mutate: sendMessage, isPending: isThinking } = useSendMessage();

  const handleSendMessage = async (content: string) => {
    let targetConversationId = activeId;
    
    // If no active conversation, create one first
    if (!targetConversationId) {
      try {
        const newConv = await CopilotService.createConversation(projectId);
        targetConversationId = newConv.id;
        setActiveId(newConv.id);
        refetchSidebar();
      } catch (err) {
        console.error("Failed to create conversation", err);
        return;
      }
    }
    
    sendMessage({ conversationId: targetConversationId, content, projectId });
  };

  const handleNewChat = async () => {
    try {
      const newConv = await CopilotService.createConversation(projectId);
      setActiveId(newConv.id);
      refetchSidebar();
    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  };

  if (isLoadingSidebar) {
    return (
      <AppLayout>
        <div className="w-full h-full p-4 sm:p-6 pb-20">
          <CopilotSkeleton />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-[calc(100vh-64px)] flex flex-col max-w-[1600px] mx-auto w-full px-2 sm:px-4 pb-4">
        <div className="shrink-0 mb-4 pt-4">
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-2">
            <span>Dashboard</span>
            <span className="opacity-50">/</span>
            <span>Projects</span>
            <span className="opacity-50">/</span>
            <span>Project {projectId}</span>
            <span className="opacity-50">/</span>
            <span className="text-primary">Copilot</span>
          </div>
        </div>

        <ProjectTabs projectId={projectId}>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              AI Copilot
            </h1>
            <p className="text-sm text-text-secondary">Your universal AI assistant for this project.</p>
          </div>
          
          <div className="flex-1 overflow-hidden min-h-[600px] border border-border rounded-lg bg-surface relative">
            <ChatLayout
              sidebar={
                <ConversationSidebar 
                  conversations={conversations || []} 
                  activeId={activeId} 
                  onSelect={setActiveId}
                  onNewChat={handleNewChat}
                />
              }
              content={
                <ChatWindow 
                  messages={messages || []} 
                  isThinking={isThinking} 
                  onSendMessage={handleSendMessage} 
                />
              }
            />
          </div>
        </ProjectTabs>
      </div>
    </AppLayout>
  );
}
