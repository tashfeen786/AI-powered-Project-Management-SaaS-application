"use client";

import { CopilotAttachment } from "@/features/copilot/mock-data";
import { File, FileText, Image as ImageIcon } from "lucide-react";

export function AttachmentCard({ attachment }: { attachment: CopilotAttachment }) {
  const getIcon = () => {
    if (attachment.type.includes('pdf')) return <FileText className="w-4 h-4 text-danger" />;
    if (attachment.type.includes('image')) return <ImageIcon className="w-4 h-4 text-success" />;
    return <File className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="flex items-center gap-3 p-2 pr-4 bg-background border border-border rounded-md shadow-sm">
      <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center shrink-0">
        {getIcon()}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-text-primary truncate max-w-[150px]">{attachment.name}</span>
        <span className="text-[10px] text-text-secondary uppercase">{attachment.size} • {attachment.type.split('/')[1] || attachment.type}</span>
      </div>
    </div>
  );
}
