import { useState, useEffect } from "react";
import { RequirementResponse } from "@/types/api";
import { useCreateRequirement, useUpdateRequirement } from "@/features/requirements/hooks/useRequirements";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: RequirementResponse | null;
  projectId: string;
}

export function RequirementModal({ isOpen, onClose, requirement, projectId }: RequirementModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    status: "Draft",
    acceptance_criteria: "",
  });

  useEffect(() => {
    if (requirement) {
      setFormData({
        title: requirement.title || "",
        description: requirement.description || "",
        category: requirement.category || "",
        priority: requirement.priority || "Medium",
        status: requirement.status || "Draft",
        acceptance_criteria: requirement.acceptance_criteria || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "Medium",
        status: "Draft",
        acceptance_criteria: "",
      });
    }
  }, [requirement, isOpen]);

  const { mutate: createReq, isPending: isCreating } = useCreateRequirement();
  const { mutate: updateReq, isPending: isUpdating } = useUpdateRequirement();

  const isSaving = isCreating || isUpdating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requirement) {
      updateReq({ id: requirement.id, data: formData, projectId }, {
        onSuccess: () => onClose()
      });
    } else {
      createReq({ ...formData, project_id: projectId }, {
        onSuccess: () => onClose()
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border w-full max-w-2xl rounded-lg shadow-xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <h2 className="text-lg font-semibold text-text-primary">
            {requirement ? "Edit Requirement" : "New Requirement"}
          </h2>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Title <span className="text-error">*</span></label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-primary"
                placeholder="e.g. User Authentication"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Category</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  placeholder="e.g. Security"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Priority</label>
                <select 
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-primary"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-primary"
              >
                <option value="Draft">Draft</option>
                <option value="Review">Review</option>
                <option value="Approved">Approved</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-primary resize-none"
                placeholder="Detailed description of the requirement..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Acceptance Criteria</label>
              <textarea 
                value={formData.acceptance_criteria}
                onChange={e => setFormData({...formData, acceptance_criteria: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-primary resize-none"
                placeholder="- Given... When... Then..."
              />
            </div>
          </div>
          
          <div className="p-4 border-t border-border bg-background/50 flex justify-end gap-3 mt-auto">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving || !formData.title.trim()}
              className="px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-[100px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
