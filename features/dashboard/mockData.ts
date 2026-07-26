import { Project, Task, Activity, Notification } from "./types";

export const mockProjects: Project[] = [
  { id: "1", name: "AI Copilot Module", description: "Integrating intelligent code suggestions into the core IDE.", status: "Active", progress: 65, members: ["JD", "AS", "BK"], lastUpdated: "2 hours ago" },
  { id: "2", name: "Q3 Marketing Website", description: "Complete redesign of the landing page and pricing.", status: "Planning", progress: 10, members: ["JD", "LW"], lastUpdated: "1 day ago" },
  { id: "3", name: "Mobile App V2", description: "React Native migration and performance improvements.", status: "Completed", progress: 100, members: ["AS", "BK", "LW", "JD"], lastUpdated: "1 week ago" },
  { id: "4", name: "Legacy API Deprecation", description: "Shutting down v1 endpoints and migrating clients.", status: "Review", progress: 90, members: ["BK", "JD"], lastUpdated: "3 weeks ago" },
  { id: "5", name: "Customer Portal", description: "Self-service dashboard for enterprise customers.", status: "Active", progress: 45, members: ["JD", "AS"], lastUpdated: "2 days ago" },
  { id: "6", name: "Billing Engine", description: "Stripe integration for usage-based billing.", status: "Planning", progress: 5, members: ["LW"], lastUpdated: "4 days ago" },
];

export const mockTasks: Task[] = [
  { id: "t1", title: "Design Database Schema", project: "AI Copilot Module", priority: "High", status: "In Progress", dueDate: "Today" },
  { id: "t2", title: "Draft SRS Document", project: "Q3 Marketing Website", priority: "Medium", status: "Todo", dueDate: "Tomorrow" },
  { id: "t3", title: "Update API Documentation", project: "Legacy API Deprecation", priority: "Low", status: "Done", dueDate: "Oct 12" },
  { id: "t4", title: "Implement Stripe Webhooks", project: "Billing Engine", priority: "High", status: "Review", dueDate: "Oct 15" },
];

export const mockActivities: Activity[] = [
  { id: "a1", title: "AI generated SRS", time: "10 mins ago" },
  { id: "a2", title: "PM approved Sprint Plan", time: "1 hour ago" },
  { id: "a3", title: "John moved Login Task", time: "3 hours ago" },
  { id: "a4", title: "Sarah uploaded requirements.pdf", time: "Yesterday" },
];

export const mockNotifications: Notification[] = [
  { id: "n1", title: "Your sprint starts tomorrow", time: "5m", read: false },
  { id: "n2", title: "AI finished SRS generation", time: "1h", read: false },
  { id: "n3", title: "Project Alpha invited you", time: "2h", read: true },
];
