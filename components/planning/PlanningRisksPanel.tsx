"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PlanningRisksPanel({ risks }: { risks: string[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!risks || risks.length === 0) return null;

  return (
    <div className="bg-[#FFFBEB] border border-warning/30 rounded-lg overflow-hidden mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-warning/10 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2 text-warning">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <h3 className="text-sm font-semibold">Identified Risks & Dependencies ({risks.length})</h3>
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
            <div className="p-4 flex flex-col gap-2">
              {risks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-text-primary">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
