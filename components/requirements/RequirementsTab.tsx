"use client";

import { useState } from "react";
import { Plus, Search, Filter, Wand2, Loader2, RefreshCw } from "lucide-react";
import { useRequirements, useDeleteRequirement } from "@/features/requirements/hooks/useRequirements";
import { RequirementList } from "./RequirementList";
import { RequirementModal } from "./RequirementModal";
import { GenerateRequirementModal } from "./GenerateRequirementModal";
import { RequirementResponse } from "@/types/api";

export function RequirementsTab({ projectId }: { projectId: string }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<RequirementResponse | null>(null);

  const { data, isLoading, isError, refetch } = useRequirements(projectId, {
    search: search || undefined,
    status: status || undefined,
    priority: priority || undefined,
    limit: 50
  });

  const { mutate: deleteReq } = useDeleteRequirement();

  const handleEdit = (req: RequirementResponse) => {
    setSelectedReq(req);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedReq(null);
    setIsModalOpen(true);
  };

  const handleDelete = (req: RequirementResponse) => {
    if (confirm("Are you sure you want to delete this requirement?")) {
      deleteReq({ id: req.id, projectId });
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
          <RequirementList 
            requirements={data.items} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
    </div>
  );
}
