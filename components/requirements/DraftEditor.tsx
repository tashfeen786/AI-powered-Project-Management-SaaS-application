"use client";

import { useState, useRef, useEffect } from "react";

export function DraftEditor({ initialContent, isLocked, onChange }: { initialContent: string; isLocked: boolean; onChange: (val: string) => void }) {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={handleChange}
      readOnly={isLocked}
      className="w-full text-sm leading-relaxed text-text-primary bg-transparent border border-transparent hover:border-border focus:border-primary focus:ring-1 focus:ring-primary rounded p-2 -mx-2 resize-none transition-colors outline-none cursor-text disabled:opacity-50 disabled:cursor-not-allowed"
      rows={1}
    />
  );
}
