"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatLayout } from "@/components/copilot/ChatLayout";
import { ConversationSidebar } from "@/components/copilot/ConversationSidebar";
import { ChatWindow } from "@/components/copilot/ChatWindow";
import { CopilotSkeleton } from "@/components/copilot/CopilotSkeleton";
import { useCopilot } from "@/features/copilot/hooks/useCopilot";
import { useConversation, useSendMessage } from "@/features/copilot/hooks/useConversation";

export default function CopilotPage() {
  const { data: conversations, isLoading: isLoadingSidebar } = useCopilot();
  const [activeId, setActiveId] = useState<string | null>("c1");
  
  const { data: messages, isLoading: isLoadingMessages } = useConversation(activeId);
  const { mutate: sendMessage, isPending: isThinking } = useSendMessage();

  const handleSendMessage = (content: string) => {
    if (!activeId) return; // In a real app, sending a message without an active ID would create a new conversation
    
    // Optimistic user message (mock implementation)
    // The useSendMessage hook already handles adding the AI response to the cache.
    // To make the UI feel instant, we would typically inject the user message optimistically here.
    sendMessage({ conversationId: activeId, content });
  };

  const handleNewChat = () => {
    setActiveId(null);
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
      <div className="w-full h-full p-0 sm:p-4 md:p-6 pb-20 sm:pb-6">
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
    </AppLayout>
  );
}
