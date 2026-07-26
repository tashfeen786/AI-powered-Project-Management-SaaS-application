export function SettingsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div>
        <div className="h-7 w-64 bg-border rounded mb-2"></div>
        <div className="h-4 w-96 bg-border rounded"></div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="h-14 bg-background border-b border-border"></div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-border rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-border rounded"></div>
              <div className="h-9 max-w-md bg-border rounded-md"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-border rounded"></div>
              <div className="h-9 bg-border rounded-md"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-border rounded"></div>
              <div className="h-9 bg-border rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="h-14 bg-background border-b border-border"></div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-border rounded"></div>
            <div className="h-9 bg-border rounded-md"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-border rounded"></div>
            <div className="h-9 bg-border rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
