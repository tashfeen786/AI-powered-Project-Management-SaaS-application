"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { TypingIndicator } from "./TypingIndicator";

export function AIThinkingCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 w-full"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border bg-primary/10 text-primary border-primary/20 relative overflow-hidden">
        <Bot className="w-4 h-4" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent animate-pulse" />
      </div>
      
      <div className="flex flex-col gap-2 max-w-[85%] items-start">
        <div className="px-4 py-3 text-sm bg-surface border border-border text-text-secondary rounded-2xl rounded-tl-sm flex items-center gap-3 shadow-sm">
          <Sparkles className="w-4 h-4 animate-pulse text-primary" />
          <span>Analyzing workspace data</span>
          <TypingIndicator />
        </div>
      </div>
    </motion.div>
  );
}
