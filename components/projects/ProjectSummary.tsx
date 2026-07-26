export function ProjectSummary({ summary }: { summary: string }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Project Summary</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
