import { Upload } from "lucide-react";

interface DocumentsHeaderProps {
  onUploadClick: () => void;
}

export function DocumentsHeader({ onUploadClick }: DocumentsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 className="text-xl font-bold text-text-primary">Documents</h1>
      
      <button 
        onClick={onUploadClick}
        className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
      >
        <Upload className="w-4 h-4" />
        Upload Document
      </button>
    </div>
  );
}
