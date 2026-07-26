"use client";

import { CopilotMessage } from "@/features/copilot/mock-data";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import { SourceReference } from "./SourceReference";
import { AIActionCard } from "./AIActionCard";
import { AttachmentCard } from "./AttachmentCard";

export function MessageBubble({ message }: { message: CopilotMessage }) {
  const isAi = message.role === 'ai';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-4 w-full", isAi ? "" : "flex-row-reverse")}
    >
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border", isAi ? "bg-primary/10 text-primary border-primary/20" : "bg-background text-text-primary border-border")}>
        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      <div className={cn("flex flex-col gap-2 max-w-[85%]", isAi ? "items-start" : "items-end")}>
        
        {/* Main Content Bubble */}
        <div className={cn("px-4 py-3 text-sm leading-relaxed", 
          isAi ? "bg-[#F5F3FF] border border-[#E5E5E5] text-text-primary rounded-2xl rounded-tl-sm whitespace-pre-wrap" : 
          "bg-primary text-surface rounded-2xl rounded-tr-sm shadow-sm whitespace-pre-wrap"
        )}>
          {/* Note: In a real app, a Markdown renderer would wrap message.content here */}
          {message.content}
        </div>

        {/* Attachments (if any) */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.attachments.map(att => (
              <AttachmentCard key={att.id} attachment={att} />
            ))}
          </div>
        )}

        {/* AI Actions (if any) */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.actions.map(action => (
              <AIActionCard key={action.id} action={action} />
            ))}
          </div>
        )}

        {/* AI Sources (if any) */}
        {message.sources && message.sources.length > 0 && (
          <div className="w-full mt-2 space-y-1.5">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Sources</div>
            <div className="flex flex-wrap gap-2">
              {message.sources.map(source => (
                <SourceReference key={source.id} source={source} />
              ))}
            </div>
          </div>
        )}

        <span className="text-[10px] text-text-secondary px-1 mt-1">{message.timestamp}</span>
      </div>
    </motion.div>
  );
}
