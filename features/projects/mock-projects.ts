export type ProjectStatus = "Planning" | "Active" | "Review" | "Completed";

export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  members: string[];
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
  createdDate: string;
  lastUpdated: string;
  summary: string;
}

export const mockProjectsDetail: ProjectDetail[] = [
  {
    id: "1",
    name: "AI Copilot Module",
    description: "Integrating intelligent code suggestions into the core IDE.",
    status: "Active",
    progress: 65,
    members: ["JD", "AS", "BK"],
    tasks: { total: 40, completed: 26, inProgress: 8, pending: 6 },
    createdDate: "Aug 12, 2026",
    lastUpdated: "2 hours ago",
    summary: "The AI Copilot Module aims to drastically reduce developer cognitive load by providing real-time, context-aware code completions. Currently focusing on model fine-tuning and latency optimization."
  },
  {
    id: "2",
    name: "Q3 Marketing Website",
    description: "Complete redesign of the landing page and pricing.",
    status: "Planning",
    progress: 10,
    members: ["JD", "LW"],
    tasks: { total: 20, completed: 2, inProgress: 3, pending: 15 },
    createdDate: "Sep 01, 2026",
    lastUpdated: "1 day ago",
    summary: "Revamping the public-facing marketing site to align with the new brand guidelines. Primary objectives are improving conversion rates and SEO performance."
  },
  {
    id: "3",
    name: "Mobile App V2",
    description: "React Native migration and performance improvements.",
    status: "Completed",
    progress: 100,
    members: ["AS", "BK", "LW", "JD"],
    tasks: { total: 45, completed: 45, inProgress: 0, pending: 0 },
    createdDate: "Jan 15, 2026",
    lastUpdated: "1 week ago",
    summary: "A complete rewrite of the legacy iOS and Android applications into a unified React Native codebase. Delivered 20% faster load times and unified feature parity."
  },
  {
    id: "4",
    name: "Legacy API Deprecation",
    description: "Shutting down v1 endpoints and migrating clients.",
    status: "Review",
    progress: 90,
    members: ["BK", "JD"],
    tasks: { total: 30, completed: 27, inProgress: 2, pending: 1 },
    createdDate: "Mar 10, 2026",
    lastUpdated: "3 weeks ago",
    summary: "Finalizing the deprecation of v1 REST APIs. All enterprise clients have been successfully migrated to GraphQL v2. Remaining tasks involve documentation updates and log monitoring."
  },
  {
    id: "5",
    name: "Customer Portal",
    description: "Self-service dashboard for enterprise customers.",
    status: "Active",
    progress: 45,
    members: ["JD", "AS"],
    tasks: { total: 50, completed: 22, inProgress: 10, pending: 18 },
    createdDate: "Jun 20, 2026",
    lastUpdated: "2 days ago",
    summary: "Building a dedicated portal for enterprise admins to manage licenses, view billing history, and provision SSO settings independently."
  },
  {
    id: "6",
    name: "Billing Engine",
    description: "Stripe integration for usage-based billing.",
    status: "Planning",
    progress: 5,
    members: ["LW"],
    tasks: { total: 15, completed: 0, inProgress: 1, pending: 14 },
    createdDate: "Oct 05, 2026",
    lastUpdated: "4 days ago",
    summary: "Migrating from flat-rate subscriptions to a complex usage-based billing engine utilizing Stripe metered billing. Currently in the architecture review phase."
  },
];
