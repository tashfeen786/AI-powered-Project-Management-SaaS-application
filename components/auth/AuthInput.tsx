"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, id, rightElement, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        <label htmlFor={id} className="block text-sm font-medium text-text-primary">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full h-9 px-3 bg-background border rounded-md text-sm text-text-primary placeholder:text-text-secondary transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
              error ? "border-danger focus:border-danger focus:ring-danger" : "border-border focus:border-primary",
              rightElement && "pr-10",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-0 top-0 h-full flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-danger mt-1 overflow-hidden"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";
