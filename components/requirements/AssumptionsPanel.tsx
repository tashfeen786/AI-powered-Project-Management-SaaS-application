"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AssumptionsPanel({ assumptions }: { assumptions: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!assumptions || assumptions.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-background hover:bg-background/80 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4 text-text-secondary" /> : <ChevronRight className="w-4 h-4 text-text-secondary" />}
          <h3 className="text-sm font-semibold text-text-primary">Assumptions ({assumptions.length})</h3>
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-5 flex flex-wrap gap-2">
              {assumptions.map((assumption, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full text-xs text-text-primary hover:border-primary transition-colors cursor-default">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  {assumption}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
