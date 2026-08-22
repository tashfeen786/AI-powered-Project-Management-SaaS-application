"use client";

import { use, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import { RequirementsTab } from "@/components/requirements/RequirementsTab";

export default function RequirementsWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <AppLayout>
      <div className="h-[calc(100vh-112px)] flex flex-col max-w-[1600px] mx-auto w-full px-2 sm:px-4 overflow-y-auto">
        
        {/* Header */}
        <div className="shrink-0 mb-4 pt-4">
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
            <span>Dashboard</span>
            <span className="opacity-50">/</span>
            <span>Projects</span>
            <span className="opacity-50">/</span>
            <span>Project {resolvedParams.id}</span>
            <span className="opacity-50">/</span>
            <span className="text-primary">Requirements</span>
          </div>
        </div>

        <ProjectTabs projectId={resolvedParams.id}>
          <RequirementsTab projectId={resolvedParams.id} />
        </ProjectTabs>
      </div>
    </AppLayout>
  );
}
