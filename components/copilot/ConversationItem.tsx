"use client";

import { useState } from "react";
import { MessageSquare, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConversationResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CopilotService } from "@/services/copilot.service";

interface ConversationItemProps {
  conversation: ConversationResponse;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title || "");
  const [showMenu, setShowMenu] = useState(false);
  
  const queryClient = useQueryClient();

  const renameMutation = useMutation({
    mutationFn: (newTitle: string) => CopilotService.renameConversation(conversation.id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copilotConversations"] });
      setIsEditing(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => CopilotService.deleteConversation(conversation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copilotConversations"] });
    }
  });

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim() && editTitle !== conversation.title) {
      renameMutation.mutate(editTitle);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={cn(
        "group relative flex flex-col p-3 rounded-md transition-colors border border-transparent",
        isActive ? "bg-primary/5 border-primary/20" : "hover:bg-background hover:border-border"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        {isEditing ? (
          <form onSubmit={handleRename} className="flex-1 mr-2" onClick={(e) => e.stopPropagation()}>
            <input 
              autoFocus
              className="w-full text-sm font-medium text-text-primary bg-background border border-primary/50 rounded px-1 outline-none"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
            />
          </form>
        ) : (
          <span 
            className="text-sm font-medium text-text-primary line-clamp-1 cursor-pointer flex-1"
            onClick={onClick}
          >
            {conversation.title || "New Chat"}
          </span>
        )}
        <div className="flex items-center gap-2">
          {!isEditing && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="p-1 text-text-secondary hover:text-primary rounded transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(); }}
                className="p-1 text-text-secondary hover:text-danger rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <span className="text-[10px] text-text-secondary whitespace-nowrap">{(conversation as any).updatedAt || new Date(conversation.created_at || '').toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
