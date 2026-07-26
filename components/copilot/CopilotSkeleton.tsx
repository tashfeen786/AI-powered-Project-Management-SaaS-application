export function CopilotSkeleton() {
  return (
    <div className="flex w-full h-[calc(100vh-140px)] border border-border bg-background rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="hidden md:flex w-[280px] h-full flex-col bg-surface border-r border-border shrink-0">
        <div className="p-4 border-b border-border">
          <div className="w-full h-9 bg-border rounded-md mb-4"></div>
          <div className="w-full h-9 bg-border rounded-md"></div>
        </div>
        <div className="p-3 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-full h-8 bg-border rounded-md"></div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-border bg-surface flex items-center gap-3">
          <div className="w-32 h-5 bg-border rounded"></div>
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="w-2/3 h-24 bg-border rounded-2xl rounded-tl-sm ml-12"></div>
          <div className="w-1/2 h-16 bg-border rounded-2xl rounded-tr-sm ml-auto mr-12"></div>
          <div className="w-3/4 h-32 bg-border rounded-2xl rounded-tl-sm ml-12"></div>
        </div>
        <div className="p-4 border-t border-border bg-surface">
          <div className="max-w-3xl mx-auto h-12 bg-border rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
