"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MissingInfoPanel({ missingInfo }: { missingInfo: string[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!missingInfo || missingInfo.length === 0) return null;

  return (
    <div className="bg-[#FFFBEB] border border-warning/30 rounded-lg overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-warning/10 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2 text-warning">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <h3 className="text-sm font-semibold">Missing Information ({missingInfo.length})</h3>
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-warning/20"
          >
            <div className="p-5 flex flex-wrap gap-2">
              {missingInfo.map((info, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-warning/30 rounded-full text-xs text-warning hover:border-warning/60 transition-colors cursor-default">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {info}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
