"use client";

import { use } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ActivityHeader } from "@/components/activity/ActivityHeader";
import { ActivityToolbar } from "@/components/activity/ActivityToolbar";
import { ActivityTimeline } from "@/components/activity/ActivityTimeline";
import { EmptyActivity } from "@/components/activity/EmptyActivity";
import { ActivitySkeleton } from "@/components/activity/ActivitySkeleton";
import { useActivity } from "@/features/activity/hooks/useActivity";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ActivityWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage 
  } = useActivity(projectId, filterType);

  const activities = data?.pages.flatMap(p => p.items) || [];

  return (
    <AppLayout>
      <div className="max-w-[1000px] mx-auto w-full px-2 sm:px-4 pb-12">
        
        {/* Breadcrumb Navigation */}
        <div className="shrink-0 mb-6 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`/projects/${projectId}`} 
              className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Back to Project
            </Link>
          </div>
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span>Dashboard</span>
            <span className="opacity-50">/</span>
            <span>Projects</span>
            <span className="opacity-50">/</span>
            <span>Project {projectId}</span>
            <span className="opacity-50">/</span>
            <span className="text-primary">Activity</span>
          </div>
        </div>

        <ActivityHeader />
        {/* Pass filter state down later if complex, but simple for now */}
        <ActivityToolbar />
        
        <div className="mt-2 bg-surface border border-border rounded-lg p-4 sm:p-6 shadow-sm">
          {isLoading ? (
            <ActivitySkeleton />
          ) : activities.length === 0 ? (
            <EmptyActivity />
          ) : (
            <>
              <ActivityTimeline activities={activities} />
              
              {hasNextPage && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-4 py-2 bg-background border border-border text-sm font-medium text-text-primary rounded hover:bg-surface disabled:opacity-50"
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
