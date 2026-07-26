"use client";

import { useState } from "react";
import { MilestoneData } from "@/features/planning/mock-data";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SprintCard } from "./SprintCard";

export function MilestoneCard({ milestone }: { milestone: MilestoneData }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6 last:mb-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 focus:outline-none rounded px-2 -mx-2 transition-colors hover:bg-background"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-5 h-5 text-text-primary" /> : <ChevronRight className="w-5 h-5 text-text-primary" />}
          <h3 className="text-base font-bold text-text-primary">Milestone: {milestone.title}</h3>
        </div>
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
            <div className="pt-2 pb-4 pl-4 ml-[9px] border-l-2 border-primary/20">
              {milestone.sprints.map(sprint => (
                <SprintCard key={sprint.id} sprint={sprint} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
