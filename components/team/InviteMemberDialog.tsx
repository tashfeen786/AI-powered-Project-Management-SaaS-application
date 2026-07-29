"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeamRole } from "@/types/api";
import { Mail, Loader2, X } from "lucide-react";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: TeamRole) => void;
  isInviting: boolean;
}

export function InviteMemberDialog({ isOpen, onClose, onInvite, isInviting }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("developer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onInvite(email.trim(), role);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-surface rounded-xl shadow-lg max-w-sm w-full p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary">Invite Team Member</h3>
              <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full h-9 pl-9 pr-3 bg-background border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as TeamRole)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="developer">Developer</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="designer">Designer</option>
                  <option value="qa">QA</option>
                </select>
              </div>

              <div className="mt-2">
                <button 
                  type="submit"
                  disabled={!email || isInviting}
                  className="w-full h-9 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 flex items-center justify-center disabled:opacity-50 gap-2"
                >
                  {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invitation"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
