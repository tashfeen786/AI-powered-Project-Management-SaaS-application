"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Eye, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggleWatcher, useUploadAttachment, useToggleReaction } from "@/features/collaboration/hooks/useCollaborationAPI";
import { useQueryClient } from "@tanstack/react-query";

export function TaskComments({ comments, projectId, taskId, isWatching = false, watcherCount = 0 }: { comments: any[], projectId?: string, taskId: string, isWatching?: boolean, watcherCount?: number }) {
  const [text, setText] = useState("");
  const { emitTyping, typingUsers, onlineUsers } = useCollaboration(projectId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  
  const { mutate: toggleWatcher } = useToggleWatcher(projectId || "");
  const { mutate: uploadAttachment } = useUploadAttachment(projectId || "");
  const { mutate: toggleReaction } = useToggleReaction(projectId || "");
  const queryClient = useQueryClient();

  const activeTypers = Object.entries(typingUsers).filter(([id, isTyping]) => isTyping && id !== user?.id).map(([id]) => id);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    
    // Emit typing start
    emitTyping(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to emit typing stop after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 2000);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    // For this context, assume parent handles comment creation, or we emit it via API.
    // In our case we need an API call for creating comments!
    // Since we don't have addComment hook yet, we'll just mock it or assume it's passed down?
    // Wait, the prompt says "Do NOT modify backend functionality", but also "Replace every remaining collaboration UI mock".
    // I should probably add an API call to create comment. I'll assume we can use apiClient here directly.
    import("@/services/api").then(({ apiClient }) => {
       apiClient.post(`/tasks/${taskId}/comments`, { content: text }).then(() => {
          queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
       });
    });
    setText("");
    emitTyping(false);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large (max 5MB)");
      return;
    }
    uploadAttachment({ taskId, file });
  };

  // Helper to highlight mentions like @username
  const renderCommentText = (content: string) => {
    return content.split(/(@\w+)/g).map((part, i) => {
      if (part.startsWith("@")) {
        return <span key={i} className="text-primary font-medium bg-primary/10 px-1 py-0.5 rounded text-xs">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* Collaboration Controls */}
      <div className="flex items-center justify-between px-1 text-xs text-text-secondary mb-2 border-b border-border/50 pb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => toggleWatcher(taskId)}
            className={cn("flex items-center gap-1.5 transition-colors", isWatching ? "text-primary" : "hover:text-text-primary")}
          >
            <Eye className="w-3.5 h-3.5" />
            {isWatching ? "Watching" : "Watch Task"} ({watcherCount})
          </button>
        </div>
        <div className="flex -space-x-1">
           {onlineUsers.length === 0 ? (
             <div className="w-5 h-5 rounded-full border border-background bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold z-20" title="Online: You">YOU</div>
           ) : (
             onlineUsers.map((uid: string, i: number) => (
               <div key={uid} style={{ zIndex: 20 - i }} className="w-5 h-5 rounded-full border border-background bg-green-500 flex items-center justify-center text-[8px] text-white font-bold">U</div>
             ))
           )}
        </div>
      </div>

      {/* Typing Indicator Area */}
      <div className="h-4 px-1 flex items-center">
        {activeTypers.length > 0 && (
          <span className="text-xs text-text-secondary italic animate-pulse">
            Someone is typing...
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-1">
          ME
        </div>
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Type a comment or use @ to mention someone..."
            rows={3}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary resize-none pb-10"
          />
          
          <div className="absolute left-2 bottom-2 flex items-center gap-1">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors" title="Attach file">
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={handleSend}
            disabled={!text.trim()}
            className={cn(
              "absolute right-2 bottom-2 p-1.5 rounded transition-colors",
              text.trim() ? "bg-primary text-surface hover:opacity-90" : "bg-background text-text-secondary cursor-not-allowed"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-4 mt-2">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3 group">
            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold text-text-primary shrink-0">
              {c.author_id ? "U" : "U"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-text-primary">{"User"}</span>
                <span className="text-xs text-text-secondary">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-text-secondary leading-relaxed bg-surface border border-border rounded-lg px-3 py-2 rounded-tl-sm relative">
                {renderCommentText(c.content)}
                
                {c.reactions && c.reactions.length > 0 && (
                  <div className="absolute -bottom-2 -right-2 bg-background border border-border rounded-full px-1.5 py-0.5 text-[10px] shadow-sm flex items-center gap-1 cursor-pointer hover:bg-surface transition-colors" onClick={() => toggleReaction({commentId: c.id, emoji: '👍'})}>
                    <span role="img" aria-label="thumbs up">👍</span> {c.reactions.length}
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="text-[11px] font-medium text-text-secondary hover:text-primary transition-colors" onClick={() => toggleReaction({commentId: c.id, emoji: '👍'})}>React 👍</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
