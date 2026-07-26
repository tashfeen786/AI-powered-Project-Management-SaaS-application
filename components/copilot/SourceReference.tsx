"use client";

import { CopilotSource } from "@/features/copilot/mock-data";
import { Folder, Clock, FileText, File, Users } from "lucide-react";

export function SourceReference({ source }: { source: CopilotSource }) {
  const getIcon = () => {
    switch (source.type) {
      case 'project': return <Folder className="w-3 h-3 text-primary" />;
      case 'sprint': return <Clock className="w-3 h-3 text-warning" />;
      case 'requirements': return <FileText className="w-3 h-3 text-success" />;
      case 'document': return <File className="w-3 h-3 text-text-secondary" />;
      case 'meeting': return <Users className="w-3 h-3 text-[#0070F3]" />;
      default: return <File className="w-3 h-3 text-text-secondary" />;
    }
  };

  return (
    <button className="flex items-center gap-1.5 px-2 py-1 bg-surface border border-border rounded text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors">
      {getIcon()}
      {source.title}
    </button>
  );
}
