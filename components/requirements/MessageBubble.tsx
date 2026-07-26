"use client";

import { Message } from "@/features/requirements/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MessageBubble({ message }: { message: Message }) {
  const isAi = message.role === 'ai';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3 mb-6", isAi ? "" : "flex-row-reverse")}
    >
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border", isAi ? "bg-primary/10 text-primary border-primary/20" : "bg-background text-text-primary border-border")}>
        {isAi ? 'AI' : 'You'}
      </div>
      <div className={cn("max-w-[85%] flex flex-col gap-1", isAi ? "items-start" : "items-end")}>
        <div className={cn("px-4 py-3 text-sm leading-relaxed", isAi ? "bg-[#F5F3FF] border border-[#E5E5E5] text-text-primary rounded-2xl rounded-tl-sm" : "bg-primary text-surface rounded-2xl rounded-tr-sm shadow-sm")}>
          {message.content}
        </div>
        <span className="text-[10px] text-text-secondary px-1">{message.timestamp}</span>
      </div>
    </motion.div>
  );
}
