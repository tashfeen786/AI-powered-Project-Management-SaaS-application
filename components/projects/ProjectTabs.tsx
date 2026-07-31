"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { RequirementsTab } from "../requirements/RequirementsTab";

const tabs = ["Overview", "Requirements", "Planning", "Board", "Documents", "Activity"];

export function ProjectTabs({ children, projectId }: { children: React.ReactNode, projectId: string }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div>
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors relative focus:outline-none",
                activeTab === tab ? "text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Overview" ? (
            children
          ) : activeTab === "Requirements" ? (
            <RequirementsTab projectId={projectId} />
          ) : (
            <div className="p-12 text-center border border-border border-dashed rounded-lg bg-surface mt-4">
              <h3 className="text-lg font-medium text-text-primary mb-2">Coming Soon</h3>
              <p className="text-sm text-text-secondary">The {activeTab} module is under construction.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
