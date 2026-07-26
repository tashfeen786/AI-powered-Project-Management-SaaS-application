"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const notifications = [
  { id: 1, title: "New task assigned", time: "2h ago", read: false },
  { id: 2, title: "Project updated", time: "5h ago", read: false },
  { id: 3, title: "Welcome to Acme", time: "1d ago", read: true },
];

export function NotificationDropdown() {
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
        className="relative p-2 text-text-secondary hover:bg-background hover:text-text-primary rounded-md transition-colors duration-150"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-1 w-80 bg-surface border border-border rounded-md shadow-sm z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="font-medium text-sm text-text-primary">Notifications</span>
              <span className="text-xs text-primary cursor-pointer hover:underline">Mark all as read</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 border-b border-border last:border-0 hover:bg-background transition-colors duration-150 cursor-pointer ${
                    !notif.read ? "bg-background/50" : ""
                  }`}
                >
                  <p className="text-sm text-text-primary">{notif.title}</p>
                  <p className="text-xs text-text-secondary mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
