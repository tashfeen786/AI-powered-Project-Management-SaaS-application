"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

interface SaveBarProps {
  isVisible: boolean;
  isSaving: boolean;
  isSaved: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export function SaveBar({ isVisible, isSaving, isSaved, onSave, onDiscard }: SaveBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-2xl px-4 z-50 pointer-events-none"
        >
          <div className="bg-[#1C1C1C] text-white shadow-xl rounded-lg px-4 py-3 flex items-center justify-between pointer-events-auto border border-white/10">
            <span className="text-sm font-medium">Unsaved changes</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={onDiscard}
                disabled={isSaving}
                className="text-sm text-white/60 hover:text-white transition-colors disabled:opacity-50"
              >
                Discard
              </button>
              <button 
                onClick={onSave}
                disabled={isSaving || isSaved}
                className="h-8 px-4 bg-white text-black rounded text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center min-w-[80px]"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black/60" />
                ) : isSaved ? (
                  <div className="flex items-center gap-1.5 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
