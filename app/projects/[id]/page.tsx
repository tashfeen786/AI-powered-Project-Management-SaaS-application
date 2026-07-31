"use client";

import { use, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import { ProjectSummary } from "@/components/projects/ProjectSummary";
import { ProjectStats } from "@/components/projects/ProjectStats";
import { ProjectMembers } from "@/components/projects/ProjectMembers";
import { QuickActions } from "@/components/projects/QuickActions";
import { useProject } from "@/features/projects/hooks/useProject";

import { Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: project, isLoading } = useProject(resolvedParams.id);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full pb-12">
        <Link 
          href="/projects" 
          className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-text-primary mb-6 transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Back to Projects
        </Link>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-text-secondary" />
          </div>
        ) : project ? (
          <>
            <ProjectHeader project={project as any} />
            <ProjectTabs projectId={resolvedParams.id}>
              <div className="flex flex-col xl:flex-row gap-6 mt-6">
                <div className="flex-1 space-y-6">
                  <ProjectSummary summary={project.description || "No description provided."} />
                  <ProjectStats tasks={{ total: 0, completed: 0, inProgress: 0, pending: 0 } as any} />
                  <div className="bg-surface border border-border rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">Recent Activity</h3>
                    <p className="text-sm text-text-secondary">No recent activity for this project yet.</p>
                  </div>
                </div>
                <div className="w-full xl:w-80 space-y-6 shrink-0">
                  <QuickActions />
                  <ProjectMembers members={[]} />
                </div>
              </div>
            </ProjectTabs>
          </>
        ) : (
          <div className="flex justify-center items-center h-64 text-text-secondary">Project not found</div>
        )}
      </div>
    </AppLayout>
  );
}
