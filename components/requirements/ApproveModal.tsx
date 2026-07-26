"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "idle" | "generating" | "success";
  successTitle?: string;
  successMessage?: string;
  buttonText?: string;
}

export function ApproveModal({ 
  isOpen, 
  onClose, 
  status,
  successTitle = "Requirements Approved!",
  successMessage = "The document is now locked and ready for planning.",
  buttonText = "View Final Document"
}: ApproveModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
              className="bg-surface rounded-xl shadow-lg max-w-sm w-full p-6 text-center border border-border"
            >
              {status === "generating" ? (
                <div className="flex flex-col items-center py-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">Generating Final Version...</h3>
                  <p className="text-sm text-text-secondary">Please wait while AI finalizes the SRS document.</p>
                </div>
              ) : status === "success" ? (
                <div className="flex flex-col items-center py-6">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{successTitle}</h3>
                  <p className="text-sm text-text-secondary mb-6">{successMessage}</p>
                  <button onClick={onClose} className="w-full h-9 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90">
                    {buttonText}
                  </button>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
