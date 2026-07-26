export function TeamSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden animate-pulse hidden md:block">
      <div className="border-b border-border bg-background flex p-4">
        <div className="flex-1 h-4 bg-border rounded max-w-[100px]"></div>
        <div className="flex-1 h-4 bg-border rounded max-w-[100px]"></div>
        <div className="flex-1 h-4 bg-border rounded max-w-[100px]"></div>
      </div>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="border-b border-border p-4 flex items-center">
          <div className="flex items-center gap-3 flex-[2]">
            <div className="w-8 h-8 rounded-full bg-border shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-border rounded w-32"></div>
              <div className="h-3 bg-border rounded w-40"></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-5 w-20 bg-border rounded"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 w-24 bg-border rounded"></div>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="w-8 h-8 rounded bg-border"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
