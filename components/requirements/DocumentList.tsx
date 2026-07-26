import { Document } from "@/features/requirements/mock-data";
import { UploadStatus } from "./UploadStatus";
import { FileText } from "lucide-react";

export function DocumentList({ documents }: { documents: Document[] }) {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-3 bg-background border border-border rounded-lg mb-4">
      <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Attached Documents</h4>
      {documents.map(doc => (
        <div key={doc.id} className="flex items-center justify-between p-2 bg-surface border border-border rounded flex-wrap gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="w-4 h-4 text-text-secondary shrink-0" />
            <span className="text-sm text-text-primary truncate">{doc.name}</span>
          </div>
          <UploadStatus status={doc.status} />
        </div>
      ))}
    </div>
  );
}
