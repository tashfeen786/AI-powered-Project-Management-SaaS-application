"use client";

import { CopilotConversation } from "@/features/copilot/mock-data";
import { MessageSquare, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: CopilotConversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors",
        isActive ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-background hover:text-text-primary"
      )}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <MessageSquare className="w-4 h-4 shrink-0" />
        <span className={cn("text-sm truncate", isActive ? "font-medium" : "")}>
          {conversation.title}
        </span>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-background transition-opacity shrink-0">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
