export function AnalyticsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-surface border border-border rounded-lg p-4">
            <div className="h-4 w-20 bg-border rounded mb-3"></div>
            <div className="h-8 w-16 bg-border rounded"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-surface border border-border rounded-lg p-4">
          <div className="h-6 w-32 bg-border rounded mb-6"></div>
          <div className="h-60 bg-border rounded w-full"></div>
        </div>
        <div className="h-80 bg-surface border border-border rounded-lg p-4">
          <div className="h-6 w-32 bg-border rounded mb-6"></div>
          <div className="h-60 bg-border rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
