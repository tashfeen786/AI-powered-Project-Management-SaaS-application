"use client";

import { ReactNode } from "react";

interface ChatLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export function ChatLayout({ sidebar, content }: ChatLayoutProps) {
  return (
    <div className="flex w-full h-[calc(100vh-140px)] border border-border bg-background rounded-xl overflow-hidden shadow-sm">
      {sidebar}
      <div className="flex-1 min-w-0 flex flex-col h-full bg-background relative">
        {content}
      </div>
    </div>
  );
}
