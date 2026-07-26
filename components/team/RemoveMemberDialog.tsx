"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { TeamMember } from "@/features/team/mock-data";

interface RemoveMemberDialogProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRemoving: boolean;
}

export function RemoveMemberDialog({ member, isOpen, onClose, onConfirm, isRemoving }: RemoveMemberDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && member && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-surface rounded-xl shadow-lg max-w-sm w-full p-6 border border-border"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Remove Member?</h3>
              <p className="text-sm text-text-secondary mb-6">
                Are you sure you want to remove <span className="font-semibold text-text-primary">{member.name}</span> from the organization? They will lose access to all projects.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={onClose}
                  disabled={isRemoving}
                  className="flex-1 h-9 bg-background border border-border text-text-primary rounded-md text-sm font-medium hover:bg-surface disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  disabled={isRemoving}
                  className="flex-1 h-9 bg-danger text-surface rounded-md text-sm font-medium hover:opacity-90 flex items-center justify-center disabled:opacity-50 gap-2"
                >
                  {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remove"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
