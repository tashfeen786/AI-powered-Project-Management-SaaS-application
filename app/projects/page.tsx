"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { EmptyProjects } from "@/components/projects/EmptyProjects";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";

export default function ProjectsPage() {
  const { data, isLoading } = useProjects();


  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Projects</h1>
            <p className="text-text-secondary text-sm">Manage all your software projects.</p>
          </div>
          <button className="h-9 px-4 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full md:w-auto shrink-0">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full h-9 pl-9 pr-4 bg-surface border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center gap-2 hover:bg-background transition-colors focus:outline-none focus:ring-1 focus:ring-primary">
              <Filter className="w-4 h-4 text-text-secondary" />
              Status
            </button>
            <button className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center gap-2 hover:bg-background transition-colors focus:outline-none focus:ring-1 focus:ring-primary">
              <ArrowUpDown className="w-4 h-4 text-text-secondary" />
              Sort
            </button>
          </div>
        </div>

        {isLoading ? (
          <ProjectGridSkeleton />
        ) : (!data?.items || data.items.length === 0) ? (
          <EmptyProjects />
        ) : (
          <ProjectGrid projects={data.items as any} />
        )}
      </div>
    </AppLayout>
  );
}
