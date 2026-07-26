import { KPIStats } from "@/features/analytics/mock-data";
import { KPICard } from "./KPICard";

export function KPIGrid({ kpis }: { kpis: KPIStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <KPICard title="Total Projects" value={kpis.totalProjects} delay={0.05} />
      <KPICard title="Active Projects" value={kpis.activeProjects} trend="+2" trendDirection="up" delay={0.1} />
      <KPICard title="Delayed Projects" value={kpis.delayedProjects} trend="-1" trendDirection="success" delay={0.15} />
      <KPICard title="Completed Projects" value={kpis.completedProjects} delay={0.2} />
      
      <KPICard title="AI Generated Docs" value={kpis.aiGeneratedDocs} trend="+12%" trendDirection="up" delay={0.25} />
      <KPICard title="AI Suggestions Accepted" value={kpis.aiSuggestionsAccepted} trend="+5%" trendDirection="up" delay={0.3} />
      <KPICard title="Team Members" value={kpis.teamMembers} delay={0.35} />
      <KPICard title="Avg Sprint Velocity" value={kpis.averageSprintVelocity} trend="-2" trendDirection="down" delay={0.4} />
    </div>
  );
}
