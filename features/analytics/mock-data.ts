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


