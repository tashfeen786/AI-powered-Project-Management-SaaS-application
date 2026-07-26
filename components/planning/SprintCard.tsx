"use client";

import { useState } from "react";
import { SprintData } from "@/features/planning/mock-data";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskCard } from "./TaskCard";

export function SprintCard({ sprint }: { sprint: SprintData }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4 last:mb-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 px-3 bg-background border border-border rounded-t-lg focus:outline-none hover:bg-background/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4 text-text-secondary" /> : <ChevronRight className="w-4 h-4 text-text-secondary" />}
          <h4 className="text-sm font-semibold text-text-primary">{sprint.title}</h4>
        </div>
        <div className="text-xs font-medium text-text-secondary">
          {sprint.tasks.length} tasks
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border border-t-0 border-border rounded-b-lg bg-surface"
          >
            <div className="p-3 bg-[#FAFAFA]">
              {sprint.tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
