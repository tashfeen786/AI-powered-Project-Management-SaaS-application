"use client";

import { useState, useRef, useEffect } from "react";
import { TeamRole } from "@/types/api";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChangeRoleDropdownProps {
  currentRole: TeamRole;
  onRoleChange: (newRole: TeamRole) => void;
  disabled?: boolean;
}

export function ChangeRoleDropdown({ currentRole, onRoleChange, disabled }: ChangeRoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const roles: TeamRole[] = ['owner', 'admin', 'member', 'viewer'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (disabled) return <div className="text-sm text-text-secondary px-3 py-1 capitalize">{currentRole}</div>;

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-medium text-text-primary hover:bg-background transition-colors focus:outline-none w-[160px] justify-between"
      >
        <span className="capitalize">{currentRole}</span>
        <ChevronDown className="w-4 h-4 text-text-secondary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-[160px] bg-surface border border-border rounded-md shadow-lg overflow-hidden py-1"
          >
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  onRoleChange(r);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-background flex items-center justify-between"
              >
                <span className="capitalize">{r}</span>
                {currentRole === r && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
