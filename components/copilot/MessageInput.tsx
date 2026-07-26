"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-end gap-2 bg-background border border-border rounded-xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
      <button 
        type="button"
        disabled={disabled}
        className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:bg-surface hover:text-text-primary transition-colors disabled:opacity-50 shrink-0 mb-0.5"
      >
        <Paperclip className="w-4 h-4" />
      </button>
      
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Copilot anything..."
        disabled={disabled}
        className="flex-1 max-h-[120px] min-h-[36px] bg-transparent text-sm text-text-primary placeholder:text-text-secondary resize-none py-2 focus:outline-none disabled:opacity-50"
        rows={1}
      />
      
      <button 
        type="button"
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:bg-border disabled:text-text-secondary shrink-0 mb-0.5"
      >
        <Send className="w-3.5 h-3.5 -ml-0.5" />
      </button>
    </div>
  );
}
