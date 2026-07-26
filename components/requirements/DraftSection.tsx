"use client";

import { useState } from "react";
import { DraftSectionData } from "@/features/requirements/mock-data";
import { LockedFieldIndicator } from "./LockedFieldIndicator";
import { DraftEditor } from "./DraftEditor";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DraftSectionProps {
  section: DraftSectionData;
  onUpdate: (id: string, content: string) => void;
}

export function DraftSection({ section, onUpdate }: DraftSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-border last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 focus:outline-none focus-visible:bg-background rounded px-2 -mx-2 transition-colors hover:bg-background"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4 text-text-secondary" /> : <ChevronRight className="w-4 h-4 text-text-secondary" />}
          <h3 className="text-sm font-semibold text-text-primary">{section.title}</h3>
        </div>
        {section.isLocked && <LockedFieldIndicator />}
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-6 border-l-2 border-primary/20 ml-[7px] mb-2">
              <DraftEditor 
                initialContent={section.content} 
                isLocked={section.isLocked}
                onChange={(val) => onUpdate(section.id, val)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
