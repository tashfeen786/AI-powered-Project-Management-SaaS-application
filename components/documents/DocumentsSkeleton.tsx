export function DocumentsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-surface border border-border rounded-lg p-4 h-[160px] flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded bg-border shrink-0"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-border rounded w-3/4"></div>
              <div className="h-3 bg-border rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-auto flex justify-between items-end border-t border-border pt-4">
            <div className="space-y-2">
              <div className="h-3 bg-border rounded w-20"></div>
              <div className="h-3 bg-border rounded w-16"></div>
            </div>
            <div className="h-5 w-16 bg-border rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
