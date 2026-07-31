"use client";

import { DocumentResponse } from "@/types/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, Trash2, Calendar, User, Edit2, Check } from "lucide-react";
import { ProcessingStatusBadge } from "./ProcessingStatusBadge";
import { useState } from "react";

interface DocumentPreviewProps {
  document: DocumentResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteRequest: () => void;
  onRenameRequest: (newName: string) => void;
}

export function DocumentPreview({ document, isOpen, onClose, onDeleteRequest, onRenameRequest }: DocumentPreviewProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  // Update newName when document changes
  if (document && newName === "" && !isRenaming) {
    setNewName(document.filename || (document as any).name);
  }

  const handleRenameSubmit = () => {
    if (newName.trim() && document) {
      onRenameRequest(newName);
      setIsRenaming(false);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && document && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-text-primary/10 backdrop-blur-[1px] z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-surface border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Document Details
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-center w-full h-40 bg-background border border-border rounded-lg mb-6">
                <FileText className="w-16 h-16 text-border" />
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                {isRenaming ? (
                  <div className="flex items-center gap-2 w-full">
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={e => setNewName(e.target.value)}
                      className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRenameSubmit();
                        if (e.key === 'Escape') {
                          setIsRenaming(false);
                          setNewName(document.filename || (document as any).name);
                        }
                      }}
                    />
                    <button onClick={handleRenameSubmit} className="p-1.5 text-success hover:bg-success/10 rounded">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      setIsRenaming(false);
                      setNewName(document.filename || (document as any).name);
                    }} className="p-1.5 text-text-secondary hover:bg-surface rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-text-primary break-all">{document.filename || (document as any).name}</h2>
                    <button onClick={() => setIsRenaming(true)} className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded transition-colors shrink-0">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              
              <div className="mb-6">
                <ProcessingStatusBadge status={document.status} />
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-text-secondary">Type</span>
                  <span className="text-sm font-medium text-text-primary uppercase">{document.content_type || (document as any).type}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-text-secondary">Folder</span>
                  <span className="text-sm font-medium text-text-primary">{document.folder_path || "root"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-text-secondary">Version</span>
                  <span className="text-sm font-medium text-text-primary">v{document.version || 1}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-text-secondary">Size</span>
                  <span className="text-sm font-medium text-text-primary">{document.size_bytes ? `${Math.round(document.size_bytes / 1024)} KB` : (document as any).size}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm text-text-secondary">Uploaded By</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{document.uploaded_by_id || (document as any).uploadedBy}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm text-text-secondary">Date</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{new Date(document.created_at).toLocaleDateString() || (document as any).uploadDate}</span>
                </div>
              </div>
              
              <p className="text-xs text-text-secondary leading-relaxed bg-background p-3 rounded border border-border">
                {document.status === "Processed" 
                  ? "This document has been successfully processed and its contents are available to the AI context."
                  : document.status === "Processing"
                  ? "Our AI is currently reading this document. Features requiring this context may be temporarily unavailable."
                  : "This document is uploaded but has not been processed yet."}
              </p>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-background flex gap-3">
              <button className="flex-1 h-9 bg-surface border border-border text-text-primary rounded-md text-sm font-medium hover:bg-background flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button 
                onClick={onDeleteRequest}
                className="flex-1 h-9 bg-danger/10 text-danger rounded-md text-sm font-medium hover:bg-danger/20 flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
