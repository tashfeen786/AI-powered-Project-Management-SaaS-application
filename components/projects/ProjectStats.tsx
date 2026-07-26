import { ProjectDetail } from "@/features/projects/mock-projects";
import { CheckCircle2, Circle, ListTodo, Clock } from "lucide-react";

export function ProjectStats({ tasks }: { tasks: ProjectDetail["tasks"] }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <ListTodo className="w-4 h-4 text-text-secondary" />
          <span className="text-xs font-medium text-text-secondary">Total Tasks</span>
        </div>
        <p className="text-xl font-bold text-text-primary">{tasks.total}</p>
      </div>
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-xs font-medium text-text-secondary">Completed</span>
        </div>
        <p className="text-xl font-bold text-text-primary">{tasks.completed}</p>
      </div>
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-text-secondary">In Progress</span>
        </div>
        <p className="text-xl font-bold text-text-primary">{tasks.inProgress}</p>
      </div>
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Circle className="w-4 h-4 text-warning" />
          <span className="text-xs font-medium text-text-secondary">Pending</span>
        </div>
        <p className="text-xl font-bold text-text-primary">{tasks.pending}</p>
      </div>
    </div>
  );
}
