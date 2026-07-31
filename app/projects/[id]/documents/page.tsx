"use client";

import { use, useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DocumentsHeader } from "@/components/documents/DocumentsHeader";
import { DocumentToolbar } from "@/components/documents/DocumentToolbar";
import { UploadDropzone } from "@/components/documents/UploadDropzone";
import { UploadProgress } from "@/components/documents/UploadProgress";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { EmptyDocuments } from "@/components/documents/EmptyDocuments";
import { DocumentsSkeleton } from "@/components/documents/DocumentsSkeleton";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { DeleteDocumentDialog } from "@/components/documents/DeleteDocumentDialog";
import { DocumentResponse } from "@/types/api";
import { useDocuments } from "@/features/documents/hooks/useDocuments";
import { useUploadDocument } from "@/features/documents/hooks/useUploadDocument";
import { useDeleteDocument } from "@/features/documents/hooks/useDeleteDocument";
import { useUpdateDocument } from "@/features/documents/hooks/useUpdateDocument";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function DocumentsWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [folderPath, setFolderPath] = useState("root");

  const { data: documents, isLoading } = useDocuments(projectId, { page, limit: 50, search: searchQuery });
  const { mutate: uploadDocument } = useUploadDocument(projectId);
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument(projectId);
  const { mutate: updateDocument } = useUpdateDocument(projectId);

  const [showUpload, setShowUpload] = useState(false);
  const [activeUpload, setActiveUpload] = useState<{ file: File; progress: number } | null>(null);
  
  const [selectedDoc, setSelectedDoc] = useState<DocumentResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUploadClick = () => {
    setShowUpload(!showUpload);
  };

  const handleFileUpload = (file: File) => {
    // Basic validation
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/csv', 
      'text/plain',
      'text/markdown',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp'
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.md')) {
      alert("Unsupported file type.");
      return;
    }

    // Simulate upload progress
    setActiveUpload({ file, progress: 0 });
    setShowUpload(false);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setActiveUpload(prev => prev ? { ...prev, progress: Math.min(progress, 90) } : null);
      if (progress >= 100) clearInterval(interval);
    }, 200);

    // Call the mutation
    uploadDocument({ file, folderPath }, {
      onSuccess: () => {
        clearInterval(interval);
        setActiveUpload(prev => prev ? { ...prev, progress: 100 } : null);
        setTimeout(() => setActiveUpload(null), 500);
      },
      onError: () => {
        clearInterval(interval);
        setActiveUpload(null);
        alert("Upload failed.");
      }
    });
  };

  const uniqueFolders = Array.from(new Set(documents?.items?.map((d: any) => d.folder_path || 'root') || ['root']));
  const filteredDocuments = documents?.items?.filter((d: any) => (d.folder_path || 'root') === folderPath) || [];

  const handleDeleteConfirm = () => {
    if (!selectedDoc) return;
    deleteDocument(selectedDoc.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedDoc(null);
      }
    });
  };

  const handleRenameRequest = (newName: string) => {
    if (!selectedDoc) return;
    updateDocument({ 
      documentId: selectedDoc.id, 
      updates: { filename: newName } 
    }, {
      onSuccess: (updatedDoc) => {
        setSelectedDoc(updatedDoc);
      }
    });
  };

  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto w-full px-2 sm:px-4 pb-12">
        
        {/* Breadcrumb Navigation */}
        <div className="shrink-0 mb-6 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`/projects/${projectId}`} 
              className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Back to Project
            </Link>
          </div>
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span>Dashboard</span>
            <span className="opacity-50">/</span>
            <span>Projects</span>
            <span className="opacity-50">/</span>
            <span>Project {projectId}</span>
            <span className="opacity-50">/</span>
            <span className="text-primary">Documents</span>
          </div>
        </div>

        <DocumentsHeader onUploadClick={handleUploadClick} />
        <DocumentToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          folderPath={folderPath}
          onFolderChange={setFolderPath}
          folders={uniqueFolders}
        />
        
        {/* Conditional Upload Area */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <UploadDropzone onUpload={handleFileUpload} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Upload Progress */}
        <AnimatePresence>
          {activeUpload && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <UploadProgress file={activeUpload.file} progress={activeUpload.progress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document Grid */}
        <div className="mt-2">
          {isLoading ? (
            <DocumentsSkeleton />
          ) : filteredDocuments.length === 0 ? (
            <EmptyDocuments onUploadClick={() => setShowUpload(true)} />
          ) : (
            <DocumentGrid documents={filteredDocuments as any} onDocumentClick={setSelectedDoc as any} />
          )}
        </div>

      </div>

      {/* Drawers and Modals */}
      <DocumentPreview 
        document={selectedDoc} 
        isOpen={!!selectedDoc && !isDeleteDialogOpen} 
        onClose={() => setSelectedDoc(null)} 
        onDeleteRequest={() => setIsDeleteDialogOpen(true)}
        onRenameRequest={handleRenameRequest}
      />

      <DeleteDocumentDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </AppLayout>
  );
}
