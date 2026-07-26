export function ProjectCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 h-[230px] flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="h-5 w-32 bg-border rounded"></div>
        <div className="h-5 w-16 bg-border rounded-full"></div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-3 w-full bg-border rounded"></div>
        <div className="h-3 w-2/3 bg-border rounded"></div>
      </div>
      <div className="h-1.5 w-full bg-border rounded-full mb-6"></div>
      <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
        <div className="flex space-x-1">
          <div className="w-6 h-6 rounded-full bg-border"></div>
          <div className="w-6 h-6 rounded-full bg-border"></div>
        </div>
        <div className="h-4 w-20 bg-border rounded"></div>
      </div>
    </div>
  );
}

export function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
