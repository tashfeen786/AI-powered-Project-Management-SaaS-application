"use client";

import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onUpload: (file: File) => void;
}

export function UploadDropzone({ onUpload }: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "w-full border-2 border-dashed rounded-lg p-8 mb-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
        isDragOver ? "border-primary bg-primary/5" : "border-border bg-surface hover:bg-background"
      )}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileSelect}
        accept=".pdf,.docx,.csv,.xlsx,.txt"
      />
      <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mb-4 border border-border">
        <UploadCloud className="w-6 h-6 text-text-secondary" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">Click or drag document to upload</h3>
      <p className="text-xs text-text-secondary">SVG, PNG, JPG or GIF (max. 800x400px)</p>
    </div>
  );
}
