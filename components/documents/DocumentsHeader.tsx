import { Upload, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";

interface DocumentsHeaderProps {
  onUploadClick: () => void;
}

export function DocumentsHeader({ onUploadClick }: DocumentsHeaderProps) {
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 className="text-xl font-bold text-text-primary">Documents</h1>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <button 
            onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
            className="h-9 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Document AI
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>
          
          {isAiMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsAiMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-56 bg-surface border border-border rounded-md shadow-lg z-50 py-1">
                <button className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Summarize Documents
                </button>
                <button className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Document Chat
                </button>
                <button className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> RAG Search
                </button>
              </div>
            </>
          )}
        </div>
        
        <button 
          onClick={onUploadClick}
          className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>
    </div>
  );
}
