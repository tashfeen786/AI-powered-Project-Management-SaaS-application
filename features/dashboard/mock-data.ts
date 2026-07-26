export const mockProjects = [
  {
    id: "1",
    name: "AI Copilot Module",
    description: "Integrating intelligent code suggestions into the core IDE.",
    status: "In Progress",
    progress: 65,
    tasksCompleted: 24,
    tasksRemaining: 12,
    lastUpdated: "2 hours ago",
    members: ["JD", "AS", "BK"],
  },
  {
    id: "2",
    name: "Q3 Marketing Website",
    description: "Complete redesign of the landing page and pricing.",
    status: "Planning",
    progress: 10,
    tasksCompleted: 2,
    tasksRemaining: 18,
    lastUpdated: "1 day ago",
    members: ["JD", "LW"],
  },
  {
    id: "3",
    name: "Mobile App V2",
    description: "React Native migration and performance improvements.",
    status: "Completed",
    progress: 100,
    tasksCompleted: 45,
    tasksRemaining: 0,
    lastUpdated: "1 week ago",
    members: ["AS", "BK", "LW", "JD"],
  },
  {
    id: "4",
    name: "Legacy API Deprecation",
    description: "Shutting down v1 endpoints and migrating clients.",
    status: "On Hold",
    progress: 40,
    tasksCompleted: 15,
    tasksRemaining: 22,
    lastUpdated: "3 weeks ago",
    members: ["BK", "JD"],
  },
];

export const mockTasks = [
  {
    id: "t1",
    title: "Design Database Schema",
    project: "AI Copilot Module",
    priority: "High",
    status: "In Progress",
    dueDate: "Today",
    assignee: "JD",
  },
  {
    id: "t2",
    title: "Draft SRS Document",
    project: "Q3 Marketing Website",
    priority: "Medium",
    status: "Todo",
    dueDate: "Tomorrow",
    assignee: "AS",
  },
  {
    id: "t3",
    title: "Update API Documentation",
    project: "Legacy API Deprecation",
    priority: "Low",
    status: "Done",
    dueDate: "Oct 12",
    assignee: "BK",
  },
];

export const mockActivities = [
  {
    id: "a1",
    user: "Alex",
    avatar: "A",
    action: "approved SRS",
    time: "10 mins ago",
  },
  {
    id: "a2",
    user: "AI",
    avatar: "🤖",
    action: "generated Sprint Plan",
    time: "1 hour ago",
  },
  {
    id: "a3",
    user: "Sarah",
    avatar: "S",
    action: "uploaded requirements.pdf",
    time: "3 hours ago",
  },
  {
    id: "a4",
    user: "John",
    avatar: "J",
    action: "completed API Integration",
    time: "Yesterday",
  },
];

export const mockNotifications = [
  {
    id: "n1",
    title: "New comment on AI Copilot Module",
    time: "5m",
  },
  {
    id: "n2",
    title: "You were assigned to 'Draft SRS Document'",
    time: "1h",
  },
  {
    id: "n3",
    title: "Sprint planning starts in 30 mins",
    time: "2h",
  },
];
