"use client";

import { useRef, useEffect } from "react";
import { CopilotMessage } from "@/features/copilot/mock-data";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { AIThinkingCard } from "./AIThinkingCard";
import { EmptyConversation } from "./EmptyConversation";
import { CopilotHeader } from "./CopilotHeader";

interface ChatWindowProps {
  messages: CopilotMessage[];
  isThinking: boolean;
  onSendMessage: (content: string) => void;
}

export function ChatWindow({ messages, isThinking, onSendMessage }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  return (
    <>
      <CopilotHeader />
      <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <EmptyConversation onSelectPrompt={onSendMessage} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isThinking && <AIThinkingCard />}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border bg-surface shrink-0">
        <div className="max-w-3xl mx-auto">
          <MessageInput onSend={onSendMessage} disabled={isThinking} />
        </div>
      </div>
    </>
  );
}
