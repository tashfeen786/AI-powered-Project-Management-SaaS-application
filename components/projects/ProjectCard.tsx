"use client";

import { motion } from "framer-motion";
import { ProjectDetail } from "@/features/projects/mock-projects";
import { StatusBadge } from "./StatusBadge";
import Link from "next/link";
import { Calendar, CheckSquare, Clock } from "lucide-react";

export function ProjectCard({ project, index }: { project: ProjectDetail; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-surface border border-border rounded-lg p-5 flex flex-col transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{project.name}</h3>
        <StatusBadge status={project.status} />
      </div>
      
      <p className="text-xs text-text-secondary line-clamp-2 mb-4 h-8">{project.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs text-text-secondary mb-1.5">
          <span>Progress</span>
          <span className="font-medium text-text-primary">{project.progress}%</span>
        </div>
        <div className="w-full bg-background border border-border rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-500 ease-out" 
            style={{ width: `${project.progress}%` }} 
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-[11px] text-text-secondary mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title="Total Tasks">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{project.tasks?.total || 0}</span>
          </div>
          <div className="flex items-center gap-1" title="Created Date">
            <Calendar className="w-3.5 h-3.5" />
            <span>{project.createdDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-1" title="Last Updated">
          <Clock className="w-3.5 h-3.5" />
          <span>{project.lastUpdated}</span>
        </div>
      </div>
      
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
        <div className="flex -space-x-2">
          {(project.members || []).map((member, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-medium text-text-primary shrink-0 ring-2 ring-surface">
              {member}
            </div>
          ))}
        </div>
        <Link 
          href={`/projects/${project.id}`}
          className="text-xs font-medium text-primary hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
        >
          Open Project
        </Link>
      </div>
    </motion.div>
  );
}
