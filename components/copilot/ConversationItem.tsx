"use client";

import { MessageSquare, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConversationResponse } from "@/types/api";

interface ConversationItemProps {
  conversation: ConversationResponse;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex flex-col p-3 rounded-md cursor-pointer transition-colors border border-transparent",
        isActive ? "bg-primary/5 border-primary/20" : "hover:bg-background hover:border-border"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-text-primary line-clamp-1">{conversation.title || "New Chat"}</span>
        <span className="text-[10px] text-text-secondary whitespace-nowrap ml-2">{(conversation as any).updatedAt}</span>
      </div>
    </div>
  );
}
