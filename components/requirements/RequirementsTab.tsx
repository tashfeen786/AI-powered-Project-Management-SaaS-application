"use client";

import { useState } from "react";
import { Plus, Search, Filter, Wand2, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { RequirementModal } from "./RequirementModal";
import { GenerateRequirementModal } from "./GenerateRequirementModal";
import { AnalyzeRequirementsModal } from "./AnalyzeRequirementsModal";
import { DeleteRequirementModal } from "./DeleteRequirementModal";
import { RequirementHistoryModal } from "./RequirementHistoryModal";
import { RequirementList } from "./RequirementList";
import { useRequirements, useDeleteRequirement } from "@/features/requirements/hooks/useRequirements";
import { RequirementResponse } from "@/types/api";

export function RequirementsTab({ projectId }: { projectId: string }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<RequirementResponse | null>(null);

  const { data, isLoading, isError, refetch } = useRequirements(projectId, {
    search: search || undefined,
    status: status || undefined,
    priority: priority || undefined,
    limit: 50
  });

  const { mutate: deleteReq, isPending: isDeleting } = useDeleteRequirement();

  const handleEdit = (req: RequirementResponse) => {
    setSelectedReq(req);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedReq(null);
    setIsModalOpen(true);
  };

  const handleDelete = (req: RequirementResponse) => {
    setSelectedReq(req);
    setIsDeleteModalOpen(true);
  };

  const handleHistory = (req: RequirementResponse) => {
    setSelectedReq(req);
    setIsHistoryModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReq) {
      deleteReq({ id: selectedReq.id, projectId }, {
        onSuccess: () => setIsDeleteModalOpen(false)
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search requirements..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Review">Review</option>
            <option value="Approved">Approved</option>
          </select>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => refetch()}
            className="p-2 text-text-secondary hover:text-text-primary bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-primary/30 text-primary rounded-md text-sm font-medium hover:bg-primary/10 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <Wand2 className="w-4 h-4" />
            Generate
          </button>
          <button 
            onClick={() => setIsAnalyzeModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-primary/30 text-primary rounded-md text-sm font-medium hover:bg-primary/10 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <Sparkles className="w-4 h-4" />
            Analyze with AI
          </button>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
          >
            <Plus className="w-4 h-4" />
            New Requirement
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading requirements...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 text-error">
            <p>Failed to load requirements. Please try again.</p>
          </div>
        ) : data?.items && data.items.length > 0 ? (
          <div className="flex flex-col">
            {(() => {
              const functionalReqs = data.items.filter((r: RequirementResponse) => r.category === "Functional");
              const nonFunctionalReqs = data.items.filter((r: RequirementResponse) => r.category === "Non-Functional");
              const uncategorizedReqs = data.items.filter((r: RequirementResponse) => r.category !== "Functional" && r.category !== "Non-Functional");

              return (
                <>
                  {functionalReqs.length > 0 && (
                    <div className="mb-4">
                      <h3 className="px-4 py-3 bg-background/80 border-b border-border text-sm font-semibold text-text-primary">Functional Requirements</h3>
                      <RequirementList 
                        requirements={functionalReqs} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onHistory={handleHistory}
                      />
                    </div>
                  )}
                  {nonFunctionalReqs.length > 0 && (
                    <div className="mb-4">
                      <h3 className="px-4 py-3 bg-background/80 border-b border-border text-sm font-semibold text-text-primary">Non-Functional Requirements</h3>
                      <RequirementList 
                        requirements={nonFunctionalReqs} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onHistory={handleHistory}
                      />
                    </div>
                  )}
                  {uncategorizedReqs.length > 0 && (
                    <div className="mb-4">
                      <h3 className="px-4 py-3 bg-background/80 border-b border-border text-sm font-semibold text-text-primary">Other Requirements</h3>
                      <RequirementList 
                        requirements={uncategorizedReqs} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onHistory={handleHistory}
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 border border-border">
              <Search className="w-6 h-6 opacity-50" />
            </div>
            <p className="text-sm">No requirements found matching your criteria.</p>
            <button 
              onClick={handleCreate}
              className="mt-4 text-sm text-primary hover:underline focus:outline-none"
            >
              Create your first requirement
            </button>
          </div>
        )}
      </div>

      <RequirementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        requirement={selectedReq}
        projectId={projectId}
      />

      <GenerateRequirementModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        projectId={projectId}
      />

      <AnalyzeRequirementsModal
        isOpen={isAnalyzeModalOpen}
        onClose={() => setIsAnalyzeModalOpen(false)}
        projectId={projectId}
      />

      <DeleteRequirementModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        requirement={selectedReq}
        isDeleting={isDeleting}
      />

      <RequirementHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        requirement={selectedReq}
      />
    </div>
  );
}
