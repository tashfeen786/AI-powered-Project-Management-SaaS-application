"use client";

import { FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function UploadProgress({ file, progress }: { file: File; progress: number }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-text-primary truncate pr-4">{file.name}</span>
            <span className="text-xs font-semibold text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
        <Loader2 className="w-5 h-5 text-text-secondary animate-spin shrink-0" />
      </div>
    </div>
  );
}
