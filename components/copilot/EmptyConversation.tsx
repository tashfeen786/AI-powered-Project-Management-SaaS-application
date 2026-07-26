"use client";

import { Bot } from "lucide-react";
import { SuggestedPrompts } from "./SuggestedPrompts";

export function EmptyConversation({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-6">
        <Bot className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">How can I help you today?</h2>
      <p className="text-sm text-text-secondary max-w-md mx-auto mb-8">
        I am your global AI assistant. I have secure access to all your workspaces, requirements, sprint plans, and team metrics.
      </p>
      
      <SuggestedPrompts onSelect={onSelectPrompt} />
    </div>
  );
}
