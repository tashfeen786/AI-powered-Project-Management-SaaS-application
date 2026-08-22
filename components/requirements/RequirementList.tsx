import { RequirementResponse } from "@/types/api";
import { FileText, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const statusStyles = {
  Draft: "bg-surface border-border text-text-secondary",
  Review: "bg-warning/10 border-warning/20 text-warning",
  Approved: "bg-success/10 border-success/20 text-success",
  Archived: "bg-background border-border text-text-secondary opacity-50",
};

const priorityStyles = {
  High: "text-error bg-error/10 border-error/20",
  Medium: "text-warning bg-warning/10 border-warning/20",
  Low: "text-success bg-success/10 border-success/20",
};

export function RequirementList({ 
  requirements, 
  onEdit, 
  onDelete,
  onHistory 
}: { 
  requirements: RequirementResponse[], 
  onEdit: (req: RequirementResponse) => void,
  onDelete: (req: RequirementResponse) => void,
  onHistory: (req: RequirementResponse) => void
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-background/50 text-xs font-semibold text-text-secondary uppercase tracking-wider">
        <div className="col-span-4 sm:col-span-5">Requirement</div>
        <div className="col-span-2 hidden sm:block">Category</div>
        <div className="col-span-2">Priority</div>
        <div className="col-span-3 sm:col-span-2">Status</div>
        <div className="col-span-1 text-right"></div>
      </div>
      
      <div className="divide-y divide-border">
        {requirements.map((req, index) => {
          if (!req) return null;
          return (
          <div key={req.id || index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-background/50 transition-colors group">
            <div className="col-span-4 sm:col-span-5 flex items-start gap-3">
              <div className="mt-0.5 p-1.5 bg-background border border-border rounded text-text-secondary shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-text-primary truncate">{req.title}</h4>
                <p className="text-xs text-text-secondary truncate mt-0.5">{req.description || "No description"}</p>
              </div>
            </div>
            
            <div className="col-span-2 hidden sm:block text-sm text-text-secondary truncate">
              {req.category || "—"}
            </div>
            
            <div className="col-span-2">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider inline-flex",
                priorityStyles[(req.priority as keyof typeof priorityStyles) || "Medium"] || priorityStyles.Medium
              )}>
                {req.priority || "Medium"}
              </span>
            </div>
            
            <div className="col-span-3 sm:col-span-2">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider inline-flex",
                statusStyles[(req.status as keyof typeof statusStyles) || "Draft"] || statusStyles.Draft
              )}>
                {req.status}
              </span>
            </div>
            
            <div className="col-span-1 text-right relative">
              <button 
                onClick={() => setOpenMenuId(openMenuId === req?.id ? null : req?.id)}
                className="p-1.5 text-text-secondary hover:text-text-primary rounded focus:outline-none focus:ring-1 focus:ring-primary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {openMenuId === req?.id && (
                <div 
                  ref={menuRef}
                  className="absolute right-0 top-8 w-36 bg-surface border border-border rounded-md shadow-lg z-10 py-1"
                >
                  <button 
                    onClick={() => { onEdit(req); setOpenMenuId(null); }}
                    className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button 
                    onClick={() => { onHistory(req); setOpenMenuId(null); }}
                    className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-background flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    History
                  </button>
                  <button 
                    onClick={() => { onDelete(req); setOpenMenuId(null); }}
                    className="w-full text-left px-3 py-1.5 text-sm text-error hover:bg-error/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
