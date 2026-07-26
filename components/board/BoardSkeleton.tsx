export function ColumnSkeleton() {
  return (
    <div className="flex-1 min-w-[280px] flex flex-col bg-background rounded-lg border border-border animate-pulse">
      <div className="p-3 border-b border-border flex justify-between items-center bg-surface rounded-t-lg">
        <div className="h-4 w-24 bg-border rounded"></div>
        <div className="h-5 w-8 bg-border rounded-full"></div>
      </div>
      <div className="p-3 flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-surface rounded border border-border p-3 h-[130px] flex flex-col">
            <div className="h-4 w-3/4 bg-border rounded mb-3"></div>
            <div className="h-3 w-1/2 bg-border rounded mb-auto"></div>
            <div className="flex justify-between items-end mt-4">
              <div className="flex gap-2">
                <div className="h-4 w-12 bg-border rounded"></div>
                <div className="h-4 w-8 bg-border rounded"></div>
              </div>
              <div className="h-6 w-6 rounded-full bg-border"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 h-full overflow-x-hidden p-1">
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
    </div>
  );
}
