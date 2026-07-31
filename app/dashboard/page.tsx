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
import { PendingInvitationsList } from "@/components/dashboard/PendingInvitationsList";
import { FolderKanban, RotateCw, CheckCircle2, ListTodo, Plus } from "lucide-react";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { useGlobalTasks } from "@/features/tasks/hooks/useGlobalTasks";
import { useGlobalActivity } from "@/features/activity/hooks/useGlobalActivity";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";


export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { data: globalTasksData } = useGlobalTasks();
  const { data: globalActivityData } = useGlobalActivity();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const globalTasks = globalTasksData?.items || [];
  const globalActivities = globalActivityData?.pages.flatMap(p => p.items) || [];
  
  const notifications = globalActivities.slice(0, 5).map(act => ({
    id: act.id,
    title: `${act.user_name || "Someone"} ${act.action} ${act.entity_type} in ${act.project_name || "Project"}`,
    time: new Date(act.created_at).toLocaleDateString(),
    read: false,
  }));


  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full pb-8">
        {isLoading ? (
          <SkeletonDashboard />
        ) : (
          <>
            <DashboardHeader />
            
            <PendingInvitationsList />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total Projects" value={data?.stats?.total || 0} icon={FolderKanban} delay={0.0} />
              <StatsCard title="Active Projects" value={data?.stats?.active || 0} icon={RotateCw} delay={0.05} />
              <StatsCard title="Planning Phase" value={data?.stats?.planning || 0} icon={ListTodo} delay={0.1} />
              <StatsCard title="Completed" value={data?.stats?.completed || 0} icon={CheckCircle2} delay={0.15} />
            </div>
            
            {/* Project Grid */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-text-primary">Projects Overview</h2>
              </div>
              {(!data?.recentProjects || data.recentProjects.length === 0) ? (
                <div className="w-full bg-surface border border-border rounded-lg border-dashed p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
                    <FolderKanban className="w-8 h-8 text-text-secondary" />
                  </div>
                  <h2 className="text-lg font-semibold text-text-primary mb-2">You don't have any projects yet.</h2>
                  <p className="text-text-secondary text-sm max-w-sm mb-6">Create your first project to begin tracking your work.</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {data.recentProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project as any} index={index} />
                  ))}
                </div>
              )}
            </section>
            
            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TaskTable tasks={globalTasks as any} />
              </div>
              <div className="flex flex-col gap-6">
                <div className="bg-surface border border-border rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Recent Activity</h3>
                  {globalActivities.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                      <ActivityTimeline activities={globalActivities} />
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary">No recent activity.</p>
                  )}
                </div>
                {notifications.length > 0 && <NotificationWidget notifications={notifications as any} />}
              </div>
            </div>
          </>
        )}
      </div>
      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppLayout>
  );
}
