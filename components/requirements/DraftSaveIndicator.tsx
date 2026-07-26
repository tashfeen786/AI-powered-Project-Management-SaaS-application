"use client";

import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DraftSaveIndicator({ isSaving }: { isSaving: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-text-secondary h-4">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Saving...
          </motion.div>
        ) : (
          <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            Saved
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
