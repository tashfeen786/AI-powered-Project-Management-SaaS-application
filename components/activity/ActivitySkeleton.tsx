export function ActivitySkeleton() {
  return (
    <div className="space-y-6 relative ml-4 mt-6 animate-pulse">
      <div className="absolute top-0 bottom-0 left-[15px] w-px bg-border"></div>
      
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex gap-4 relative">
          <div className="w-8 h-8 rounded-full bg-border z-10 ring-4 ring-background shrink-0 mt-0.5"></div>
          <div className="flex-1 bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-32 bg-border rounded"></div>
              <div className="h-4 w-24 bg-border rounded"></div>
            </div>
            <div className="h-3 w-3/4 bg-border rounded mb-2"></div>
            <div className="h-3 w-1/2 bg-border rounded mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
