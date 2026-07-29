"use client";

import { ConversationResponse } from "@/types/api";
import { ConversationItem } from "./ConversationItem";
import { ConversationSearch } from "./ConversationSearch";
import { Plus } from "lucide-react";

interface ConversationSidebarProps {
  conversations: ConversationResponse[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export function ConversationSidebar({ conversations, activeId, onSelect, onNewChat }: ConversationSidebarProps) {
  const pinned = conversations.filter((c: any) => c.isPinned);
  const recent = conversations.filter((c: any) => !c.isPinned);

  return (
    <div className="w-full md:w-[280px] h-full flex flex-col bg-surface border-r border-border shrink-0">
      <div className="p-4 border-b border-border">
        <button 
          onClick={onNewChat}
          className="w-full h-9 flex items-center justify-center gap-2 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity mb-4"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
        <ConversationSearch />
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        
        {pinned.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-2">Pinned</div>
            <div className="space-y-1">
              {pinned.map(conv => (
                <ConversationItem 
                  key={conv.id} 
                  conversation={conv} 
                  isActive={activeId === conv.id} 
                  onClick={() => onSelect(conv.id)} 
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-2">Recent</div>
          <div className="space-y-1">
            {recent.map(conv => (
              <ConversationItem 
                key={conv.id} 
                conversation={conv} 
                isActive={activeId === conv.id} 
                onClick={() => onSelect(conv.id)} 
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
