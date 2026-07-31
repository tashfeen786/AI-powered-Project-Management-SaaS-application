"use client";

import { use, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatLayout } from "@/components/copilot/ChatLayout";
import { ConversationSidebar } from "@/components/copilot/ConversationSidebar";
import { ChatWindow } from "@/components/copilot/ChatWindow";
import { CopilotSkeleton } from "@/components/copilot/CopilotSkeleton";
import { useCopilot } from "@/features/copilot/hooks/useCopilot";
import { useConversation, useSendMessage } from "@/features/copilot/hooks/useConversation";
import { CopilotService } from "@/services/copilot.service";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
      <div className="w-full h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] p-0 sm:p-4 md:p-6 pb-20 sm:pb-6 flex flex-col">
        <Link 
          href={`/projects/${projectId}`}
          className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-text-primary mb-4 transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1 shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Back to Project
        </Link>
        <div className="flex-1 overflow-hidden">
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
      </div>
    </AppLayout>
  );
}
