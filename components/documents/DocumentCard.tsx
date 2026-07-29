import { DocumentResponse } from "@/types/api";
import { ProcessingStatusBadge } from "./ProcessingStatusBadge";
import { FileText, MoreVertical } from "lucide-react";

interface DocumentCardProps {
  document: DocumentResponse;
  onClick: (doc: DocumentResponse) => void;
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  return (
    <div 
      onClick={() => onClick(document)}
      className="bg-surface border border-border rounded-lg p-4 flex flex-col hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-surface transition-colors">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-text-primary truncate" title={document.filename || (document as any).name}>{document.filename || (document as any).name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">{document.content_type || (document as any).type}</span>
            <span className="text-[10px] text-text-secondary">•</span>
            <span className="text-xs text-text-secondary">{document.file_size ? `${Math.round(document.file_size / 1024)} KB` : (document as any).size}</span>
          </div>
        </div>
        <button className="p-1 text-text-secondary hover:text-text-primary rounded focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
        <div>
          <div className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mb-0.5">Uploaded By</div>
          <div className="text-xs font-medium text-text-primary truncate max-w-[100px]">{document.uploaded_by_id || (document as any).uploadedBy}</div>
        </div>
        <ProcessingStatusBadge status={document.status} />
      </div>
    </div>
  );
}
