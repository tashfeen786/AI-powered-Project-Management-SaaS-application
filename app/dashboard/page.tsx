"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { TaskTable } from "@/components/dashboard/TaskTable";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { NotificationWidget } from "@/components/dashboard/NotificationWidget";
import { SkeletonDashboard } from "@/components/dashboard/SkeletonDashboard";
import { mockProjects, mockTasks, mockActivities, mockNotifications } from "@/features/dashboard/mockData";
import { FolderKanban, RotateCw, CheckCircle2, ListTodo, Plus } from "lucide-react";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full pb-8">
        {isLoading ? (
          <SkeletonDashboard />
        ) : (
          <>
            <DashboardHeader />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Projects" value={12} icon={FolderKanban} delay={0.0} />
              <StatsCard title="Active Sprint" value={3} icon={RotateCw} delay={0.05} />
              <StatsCard title="Pending Tasks" value={18} icon={ListTodo} delay={0.1} />
              <StatsCard title="Completed" value={146} icon={CheckCircle2} delay={0.15} />
            </div>
            
            {/* Project Grid */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-text-primary">Projects Overview</h2>
              </div>
              {mockProjects.length === 0 ? (
                <div className="w-full bg-surface border border-border rounded-lg border-dashed p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
                    <FolderKanban className="w-8 h-8 text-text-secondary" />
                  </div>
                  <h2 className="text-lg font-semibold text-text-primary mb-2">You don't have any projects yet.</h2>
                  <p className="text-text-secondary text-sm max-w-sm mb-6">Create your first project to begin tracking your work.</p>
                  <button className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Plus className="w-4 h-4" />
                    Create First Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {mockProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              )}
            </section>
            
            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TaskTable tasks={mockTasks} />
              </div>
              <div className="flex flex-col gap-6">
                <ActivityTimeline activities={mockActivities} />
                <NotificationWidget notifications={mockNotifications} />
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
