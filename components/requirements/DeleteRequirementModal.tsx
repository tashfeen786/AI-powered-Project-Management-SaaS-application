import { RequirementResponse } from "@/types/api";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requirement: RequirementResponse | null;
  isDeleting: boolean;
}

export function DeleteRequirementModal({ isOpen, onClose, onConfirm, requirement, isDeleting }: DeleteRequirementModalProps) {
  if (!isOpen || !requirement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border w-full max-w-md rounded-lg shadow-xl z-10 overflow-hidden flex flex-col"
      >
        <div className="p-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">Delete Requirement</h2>
          <p className="text-sm text-text-secondary mb-1">
            Are you sure you want to delete <strong>{requirement.title}</strong>?
          </p>
          <p className="text-sm text-error/80">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="p-4 border-t border-border bg-background/50 flex justify-center gap-3">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 bg-error text-white rounded-md text-sm font-medium hover:bg-error/90 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px] focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-background"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
