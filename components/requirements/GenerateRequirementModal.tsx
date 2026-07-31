import { useState } from "react";
import { useGenerateRequirement } from "@/features/requirements/hooks/useRequirements";
import { X, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface GenerateRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function GenerateRequirementModal({ isOpen, onClose, projectId }: GenerateRequirementModalProps) {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");

  const { mutate: generateReq, isPending } = useGenerateRequirement();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    generateReq({ 
      projectId, 
      data: { 
        title, 
        additional_context: context 
      }
    }, {
      onSuccess: () => {
        setTitle("");
        setContext("");
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border w-full max-w-lg rounded-lg shadow-xl z-10 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Generate Requirement (AI)</h2>
          </div>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Requirement Title <span className="text-error">*</span></label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-primary"
                placeholder="e.g. Real-time Notifications System"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Additional Context</label>
              <textarea 
                value={context}
                onChange={e => setContext(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-primary resize-none"
                placeholder="Provide specific details, user stories, or technical constraints you want the AI to consider..."
              />
              <p className="text-xs text-text-secondary mt-2">
                The AI will use your project's existing documents and the context provided above to draft a comprehensive requirement.
              </p>
            </div>
          </div>
          
          <div className="p-4 border-t border-border bg-background/50 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending || !title.trim()}
              className="px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
