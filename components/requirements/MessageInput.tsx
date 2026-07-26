"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { UploadDocumentButton } from "./UploadDocumentButton";
import { cn } from "@/lib/utils";

export function MessageInput({ onSend, isAiTyping }: { onSend: (text: string) => void; isAiTyping: boolean }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isAiTyping) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-surface border border-border rounded-xl p-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
      <UploadDocumentButton />
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isAiTyping ? "AI is typing..." : "Type a message..."}
        disabled={isAiTyping}
        rows={1}
        className="flex-1 max-h-[120px] bg-transparent resize-none py-2 px-1 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!text.trim() || isAiTyping}
        className={cn(
          "p-2 rounded-lg transition-colors flex items-center justify-center shrink-0 mb-0.5",
          text.trim() && !isAiTyping ? "bg-primary text-surface hover:opacity-90" : "bg-background text-text-secondary cursor-not-allowed"
        )}
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
