"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronsUpDown, Check, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const organizations = [
  { id: "1", name: "Acme Software" },
  { id: "2", name: "TechCorp" },
  { id: "3", name: "My Startup" },
];

export function OrganizationSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(organizations[0]);
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
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full hover:bg-background transition-colors duration-150 p-1.5 rounded-md border border-transparent hover:border-border"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium truncate text-text-primary">
            {selected.name}
          </span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-text-secondary shrink-0 ml-2" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-1 w-[200px] bg-surface border border-border rounded-md shadow-sm z-50 py-1"
          >
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  setSelected(org);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-text-primary hover:bg-background transition-colors duration-150"
              >
                <span>{org.name}</span>
                {selected.id === org.id && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
