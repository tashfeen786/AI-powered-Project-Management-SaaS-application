export interface KPIStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  aiGeneratedDocs: number;
  aiSuggestionsAccepted: number;
  teamMembers: number;
  averageSprintVelocity: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TeamPerformance {
  id: string;
  member: string;
  avatar: string;
  role: string;
  completedTasks: number;
  velocity: number;
  activeTasks: number;
  efficiency: number;
}

export interface AIEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface AnalyticsData {
  kpis: KPIStats;
  projectStatus: ChartDataPoint[];
  sprintVelocity: ChartDataPoint[];
  burndown: ChartDataPoint[];
  productivity: ChartDataPoint[];
  aiUsageTrend: ChartDataPoint[];
  teamPerformance: TeamPerformance[];
  aiInsights: string[];
  riskPrediction: {
    overallScore: number;
    budgetRisk: string;
    timelineRisk: string;
    teamCapacityRisk: string;
  };
  deliveryForecast: {
    predictedDate: string;
    confidence: number;
    estimatedDelay: string;
    scheduleHealth: string;
  };
  recentAIEvents: AIEvent[];
}

export const mockAnalyticsData: AnalyticsData = {
  kpis: {
    totalProjects: 42,
    activeProjects: 14,
    completedProjects: 25,
    delayedProjects: 3,
    aiGeneratedDocs: 156,
    aiSuggestionsAccepted: 1420,
    teamMembers: 24,
    averageSprintVelocity: 45,
  },
  projectStatus: [
    { name: 'Active', value: 14, fill: '#3b82f6' },
    { name: 'Completed', value: 25, fill: '#10b981' },
    { name: 'Delayed', value: 3, fill: '#ef4444' }
  ],
  sprintVelocity: [
    { name: 'Sprint 1', velocity: 35 },
    { name: 'Sprint 2', velocity: 42 },
    { name: 'Sprint 3', velocity: 40 },
    { name: 'Sprint 4', velocity: 48 },
    { name: 'Sprint 5', velocity: 45 },
    { name: 'Sprint 6', velocity: 52 }
  ],
  burndown: [
    { name: 'Day 1', remaining: 100, ideal: 100 },
    { name: 'Day 2', remaining: 90, ideal: 90 },
    { name: 'Day 3', remaining: 85, ideal: 80 },
    { name: 'Day 4', remaining: 70, ideal: 70 },
    { name: 'Day 5', remaining: 50, ideal: 60 },
    { name: 'Day 6', remaining: 40, ideal: 50 },
    { name: 'Day 7', remaining: 35, ideal: 40 },
    { name: 'Day 8', remaining: 20, ideal: 30 },
    { name: 'Day 9', remaining: 15, ideal: 20 },
    { name: 'Day 10', remaining: 0, ideal: 0 }
  ],
  productivity: [
    { name: 'Mon', tasks: 12 },
    { name: 'Tue', tasks: 18 },
    { name: 'Wed', tasks: 15 },
    { name: 'Thu', tasks: 22 },
    { name: 'Fri', tasks: 25 },
    { name: 'Sat', tasks: 5 },
    { name: 'Sun', tasks: 2 }
  ],
  aiUsageTrend: [
    { name: 'Week 1', generations: 15, acceptances: 12 },
    { name: 'Week 2', generations: 25, acceptances: 20 },
    { name: 'Week 3', generations: 32, acceptances: 28 },
    { name: 'Week 4', generations: 45, acceptances: 40 }
  ],
  teamPerformance: [
    { id: '1', member: 'Alex Smith', avatar: 'AS', role: 'Frontend Lead', completedTasks: 45, velocity: 52, activeTasks: 3, efficiency: 94 },
    { id: '2', member: 'Sarah Jones', avatar: 'SJ', role: 'Backend Lead', completedTasks: 38, velocity: 48, activeTasks: 4, efficiency: 91 },
    { id: '3', member: 'Mike Johnson', avatar: 'MJ', role: 'Designer', completedTasks: 25, velocity: 30, activeTasks: 2, efficiency: 88 },
    { id: '4', member: 'Emily Brown', avatar: 'EB', role: 'QA Engineer', completedTasks: 60, velocity: 65, activeTasks: 5, efficiency: 96 }
  ],
  aiInsights: [
    'Project Alpha is at risk of delay due to frontend bottleneck.',
    'Sprint 6 velocity increased by 15% after AI planning.',
    'Low confidence score detected in recent API spec draft.',
    'Team capacity is optimal for next week.'
  ],
  riskPrediction: {
    overallScore: 24,
    budgetRisk: 'Low',
    timelineRisk: 'Medium',
    teamCapacityRisk: 'Low'
  },
  deliveryForecast: {
    predictedDate: 'Nov 15, 2026',
    confidence: 88,
    estimatedDelay: '+2 days',
    scheduleHealth: 'Good'
  },
  recentAIEvents: [
    { id: 'e1', type: 'Generation', description: 'AI generated Project Alpha SRS', timestamp: '2 hours ago' },
    { id: 'e2', type: 'Planning', description: 'AI suggested Sprint 6 Plan', timestamp: '5 hours ago' },
    { id: 'e3', type: 'Action', description: 'AI split Task-142 into subtasks', timestamp: '1 day ago' },
    { id: 'e4', type: 'Approval', description: 'AI generated architecture approved', timestamp: '2 days ago' }
  ]
};
