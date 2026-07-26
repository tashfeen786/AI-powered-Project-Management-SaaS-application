import { ProjectDetail } from "@/features/projects/mock-projects";
import { StatusBadge } from "./StatusBadge";

export function ProjectHeader({ project }: { project: ProjectDetail }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-2xl font-bold text-text-primary">{project.name}</h1>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-text-secondary text-sm max-w-3xl leading-relaxed">{project.description}</p>
      
      <div className="flex items-center gap-6 mt-6 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-primary">Created:</span>
          {project.createdDate}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-primary">Progress:</span>
          {project.progress}%
        </div>
      </div>
    </div>
  );
}
