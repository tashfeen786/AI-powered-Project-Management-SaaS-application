"use client";

import { Message, Document } from "@/features/requirements/mock-data";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { MessageInput } from "./MessageInput";
import { DocumentList } from "./DocumentList";
import { useEffect, useRef } from "react";

interface ConversationPanelProps {
  messages: Message[];
  documents: Document[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

export function ConversationPanel({ messages, documents, onSendMessage, isTyping }: ConversationPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-background">
        <h2 className="text-sm font-semibold text-text-primary">Conversation</h2>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 pb-2">
        <DocumentList documents={documents} />
        
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      
      <div className="p-4 bg-background border-t border-border">
        <MessageInput onSend={onSendMessage} isAiTyping={isTyping} />
      </div>
    </div>
  );
}
