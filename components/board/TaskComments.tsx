"use client";

import { useState } from "react";

import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskComments({ comments }: { comments: any[] }) {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-1">
          ME
        </div>
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
          <button 
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
          <div key={c.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold text-text-primary shrink-0">
              {c.author_id ? "U" : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-text-primary">{"User"}</span>
                <span className="text-xs text-text-secondary">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed bg-surface border border-border rounded-lg px-3 py-2 rounded-tl-sm">
                {c.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
