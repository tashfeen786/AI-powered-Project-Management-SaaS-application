"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthService } from "@/services/auth.service";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 hover:bg-primary/20 transition-colors duration-150 ml-2"
      >
        <User className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-1 w-48 bg-surface border border-border rounded-md shadow-sm z-50 py-1"
          >
            <div className="px-3 py-2 border-b border-border mb-1">
              <p className="text-sm font-medium text-text-primary">John Doe</p>
              <p className="text-xs text-text-secondary truncate">john@example.com</p>
            </div>
            
            <button className="w-full flex items-center px-3 py-2 text-sm text-text-primary hover:bg-background transition-colors duration-150">
              <User className="w-4 h-4 mr-2 text-text-secondary" />
              Profile
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-text-primary hover:bg-background transition-colors duration-150">
              <Settings className="w-4 h-4 mr-2 text-text-secondary" />
              Settings
            </button>
            <div className="h-px bg-border my-1" />
            <button 
              onClick={() => AuthService.logout()}
              className="w-full flex items-center px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
