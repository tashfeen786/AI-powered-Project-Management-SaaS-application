"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { NotificationCard } from "@/components/dashboard/NotificationCard";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";

import { mockProjects, mockTasks, mockActivities, mockNotifications } from "@/features/dashboard/mock-data";
import { Plus, Sparkles, Calendar, Users } from "lucide-react";

export default function DashboardPage() {
  const [projects] = useState(mockProjects);
  
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto pb-8">
        <DashboardHeader 
          title="Dashboard" 
          subtitle="Welcome back. Here's what's happening across your organization." 
        />
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickActionCard title="Create Project" description="Start a new initiative" icon={Plus} />
          <QuickActionCard title="Generate SRS" description="AI assisted documentation" icon={Sparkles} />
          <QuickActionCard title="Sprint Planning" description="Organize upcoming work" icon={Calendar} />
          <QuickActionCard title="Invite Team" description="Add members to workspace" icon={Users} />
        </div>
        
        {projects.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <div className="space-y-8">
            {/* Projects Overview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-text-primary">Projects Overview</h2>
                <button className="text-xs font-medium text-primary hover:underline">View all</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
            
            {/* Bottom Grid: Tasks, Activity, Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TaskList tasks={mockTasks} />
              </div>
              <div className="space-y-6">
                <NotificationCard notifications={mockNotifications} />
                <ActivityTimeline activities={mockActivities} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
