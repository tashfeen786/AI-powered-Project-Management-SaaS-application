"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DangerZone() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setIsOpen(false);
    }, 1000);
  };

  return (
    <>
      <div className="bg-surface border border-danger/30 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-danger/20 bg-danger/5">
          <h2 className="text-base font-semibold text-danger">Danger Zone</h2>
        </div>
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Delete Organization</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-md">
              Permanently delete this organization and all of its projects, documents, and settings. This action cannot be undone.
            </p>
          </div>
          <button 
            onClick={() => setIsOpen(true)}
            className="h-9 px-4 bg-danger/10 text-danger border border-danger/20 rounded-md text-sm font-medium hover:bg-danger/20 transition-colors shrink-0"
          >
            Delete Organization
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
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
              className="bg-surface rounded-xl shadow-lg max-w-md w-full p-6 border border-danger/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Delete Organization</h3>
                <p className="text-sm text-text-secondary mb-6">
                  Are you absolutely sure? This will permanently delete the organization, all projects, data, and active subscriptions.
                </p>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setIsOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 h-9 bg-background border border-border text-text-primary rounded-md text-sm font-medium hover:bg-surface disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 h-9 bg-danger text-surface rounded-md text-sm font-medium hover:opacity-90 flex items-center justify-center disabled:opacity-50 gap-2"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
