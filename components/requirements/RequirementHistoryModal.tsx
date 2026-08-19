import { useState, useEffect } from "react";
import { X, Loader2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { RequirementResponse } from "@/types/api";

interface RequirementHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: RequirementResponse | null;
}

export function RequirementHistoryModal({ isOpen, onClose, requirement }: RequirementHistoryModalProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && requirement) {
      setIsLoading(true);
      fetch(`/api/v1/requirements/${requirement.id}/history`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            setHistory(data.data);
          } else {
            setError(data.message || "Failed to load history");
          }
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load history");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, requirement]);

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
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Requirement History
          </h2>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-background/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading history...</p>
            </div>
          ) : error ? (
            <div className="text-center text-error py-8">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center text-text-secondary py-8">No history recorded yet.</div>
          ) : (
            <div className="space-y-6">
              {history.map((h, index) => (
                <div key={h.id} className="relative pl-6 border-l-2 border-border pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-surface" />
                  <div className="bg-surface border border-border rounded-md p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-text-primary">Version {h.version}</h4>
                      <span className="text-xs text-text-secondary">{new Date(h.created_at).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-text-secondary mb-3">
                      Changed by: <span className="font-medium text-text-primary">{h.changed_by_name}</span>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">Changes:</h5>
                      <ul className="list-disc pl-4 text-sm text-text-secondary space-y-1">
                        {h.change_summary.split(', ').map((change: string, i: number) => (
                          <li key={i}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
