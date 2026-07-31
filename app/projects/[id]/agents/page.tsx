"use client";

import { use } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import Link from "next/link";
import { ChevronLeft, Briefcase, Calendar, Users, Code, ShieldCheck, Activity } from "lucide-react";
import { ProjectTabs } from "@/components/projects/ProjectTabs";

export default function AgentsDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const agents = [
    {
      id: "business_analyst",
      name: "Business Analyst",
      description: "Generates SRS, BRD, User Stories, Acceptance Criteria, and handles Gap Analysis.",
      icon: Briefcase,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    {
      id: "project_manager",
      name: "Project Manager",
      description: "Estimates timeline, resources, cost, predicts delays, and generates Roadmaps.",
      icon: Activity,
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
    },
    {
      id: "scrum_master",
      name: "Scrum Master",
      description: "Creates Sprints, detects blockers, and runs Daily Standups & Retrospectives.",
      icon: Users,
      color: "bg-orange-500/10 text-orange-600 border-orange-500/20"
    },
    {
      id: "architect",
      name: "Software Architect",
      description: "Suggests Architecture, ERDs, API Designs, and Tech Stack choices.",
      icon: Calendar, // Could use a better icon if available, but Calendar works for planning
      color: "bg-green-500/10 text-green-600 border-green-500/20"
    },
    {
      id: "qa",
      name: "QA Agent",
      description: "Generates Test Cases, Unit Tests, API Tests, and Regression Checklists.",
      icon: ShieldCheck,
      color: "bg-red-500/10 text-red-600 border-red-500/20"
    },
    {
      id: "reviewer",
      name: "Code Reviewer",
      description: "Reviews Code, suggests improvements, detects bugs, and runs Security Reviews.",
      icon: Code,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
    }
  ];

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full pb-12">
        <Link 
          href={`/projects/${projectId}`}
          className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-text-primary mb-6 transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Back to Project
        </Link>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">AI Agents</h1>
          <p className="text-sm text-text-secondary">
            Deploy specialized autonomous AI agents to manage different aspects of your project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Link href={`/projects/${projectId}/agents/${agent.id}`} key={agent.id}>
              <div className="group h-full bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-4 transition-colors ${agent.color}`}>
                  <agent.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {agent.name}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {agent.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
