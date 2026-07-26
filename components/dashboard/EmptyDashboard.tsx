import { FolderKanban, Plus } from "lucide-react";

export function EmptyDashboard() {
  return (
    <div className="w-full bg-surface border border-border rounded-lg border-dashed p-12 flex flex-col items-center justify-center text-center mt-6">
      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
        <FolderKanban className="w-8 h-8 text-text-secondary" />
      </div>
      <h2 className="text-lg font-semibold text-text-primary mb-2">No projects yet</h2>
      <p className="text-text-secondary text-sm max-w-sm mb-6">
        Create your first project to begin tracking tasks, sprints, and team velocity.
      </p>
      <button className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <Plus className="w-4 h-4" />
        Create Project
      </button>
    </div>
  );
}
