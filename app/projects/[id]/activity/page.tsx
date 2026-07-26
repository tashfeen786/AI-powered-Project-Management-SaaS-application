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
import Link from "next/link";

export default function ActivityWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const { data: activities, isLoading } = useActivity(projectId);

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
        <ActivityToolbar />
        
        <div className="mt-2 bg-surface border border-border rounded-lg p-4 sm:p-6 shadow-sm">
          {isLoading ? (
            <ActivitySkeleton />
          ) : !activities || activities.length === 0 ? (
            <EmptyActivity />
          ) : (
            <ActivityTimeline activities={activities} />
          )}
        </div>

      </div>
    </AppLayout>
  );
}
