"use client";

import { Search } from "lucide-react";

export function ConversationSearch() {
  return (
    <div className="relative">
      <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
      <input 
        type="text" 
        placeholder="Search chats..."
        className="w-full h-9 pl-9 pr-3 bg-background border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
      />
    </div>
  );
}
