export function SkeletonDashboard() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="mb-8">
        <div className="h-8 w-48 bg-border rounded mb-2"></div>
        <div className="h-4 w-96 bg-border rounded"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-surface border border-border rounded-lg p-5 h-24"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-surface border border-border rounded-lg p-5 h-40"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-surface border border-border rounded-lg"></div>
        <div className="h-64 bg-surface border border-border rounded-lg"></div>
      </div>
    </div>
  );
}
