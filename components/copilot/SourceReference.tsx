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

  if (source.document_id) {
    // Assuming the user is in the project context since the URL is /projects/[id]/copilot
    // A quick hack since we don't have projectId natively in the component
    const match = typeof window !== 'undefined' ? window.location.pathname.match(/\/projects\/([^/]+)/) : null;
    const projectId = match ? match[1] : '';
    
    return (
      <a 
        href={`/projects/${projectId}/documents?docId=${source.document_id}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 px-2 py-1 bg-surface border border-border rounded text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
      >
        {getIcon()}
        {source.title}
      </a>
    );
  }

  return (
    <button className="flex items-center gap-1.5 px-2 py-1 bg-surface border border-border rounded text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors cursor-default">
      {getIcon()}
      {source.title}
    </button>
  );
}
