"use client";

import { motion } from "framer-motion";
import { Project } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const statusStyles = {
  Planning: "bg-surface border-border text-text-secondary",
  Active: "bg-primary/10 border-primary/20 text-primary",
  Review: "bg-warning/10 border-warning/20 text-warning",
  Completed: "bg-success/10 border-success/20 text-success",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="bg-surface border border-border rounded-lg p-5 flex flex-col cursor-pointer transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{project.name}</h3>
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider shrink-0 ml-2", statusStyles[project.status])}>
          {project.status}
        </span>
      </div>
      
      <p className="text-xs text-text-secondary line-clamp-2 mb-4 h-8">{project.description}</p>
      
      <div className="w-full bg-background border border-border rounded-full h-1.5 overflow-hidden mb-5">
        <div 
          className="bg-primary h-full transition-all duration-500 ease-out" 
          style={{ width: `${project.progress}%` }} 
        />
      </div>
      
      <div className="mt-auto flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.map((member, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-medium text-text-primary shrink-0 ring-2 ring-surface">
              {member}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-text-secondary">Updated {project.lastUpdated}</span>
          <button className="text-xs font-medium text-primary hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded">
            Open Project
          </button>
        </div>
      </div>
    </motion.div>
  );
}
