"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Home, FolderKanban, Users, Settings } from "lucide-react";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const content = (
    <div className="flex-1 py-4 flex flex-col gap-1 px-3">
      <SidebarItem icon={Home} label="Dashboard" href="/dashboard" isActive />
      <SidebarItem icon={FolderKanban} label="Projects" href="/projects" />
      <SidebarItem icon={Users} label="Team" href="/team" />
      <SidebarItem icon={Settings} label="Settings" href="/settings" />
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col bg-surface border-r border-border fixed inset-y-0 left-0 z-40 md:w-[68px] lg:w-[240px] transition-all duration-200">
        <div className="h-14 flex items-center justify-center lg:justify-start lg:px-6 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
            <span className="text-surface font-bold text-lg leading-none">A</span>
          </div>
          <span className="font-semibold text-text-primary ml-3 hidden lg:block">AI SaaS</span>
        </div>
        {content}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-text-primary/20 z-40 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-[240px] bg-surface border-r border-border flex flex-col md:hidden"
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-border">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
                    <span className="text-surface font-bold text-lg leading-none">A</span>
                  </div>
                  <span className="font-semibold text-text-primary ml-3">AI SaaS</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-text-secondary hover:bg-background hover:text-text-primary rounded-md transition-colors duration-150"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
