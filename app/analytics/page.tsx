"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { KPIGrid } from "@/components/analytics/KPIGrid";
import { ProductivityChart } from "@/components/analytics/ProductivityChart";
import { SprintVelocityChart } from "@/components/analytics/SprintVelocityChart";
import { BurndownChart } from "@/components/analytics/BurndownChart";
import { ProjectStatusChart } from "@/components/analytics/ProjectStatusChart";
import { TeamPerformanceTable } from "@/components/analytics/TeamPerformanceTable";
import { AIInsightsCard } from "@/components/analytics/AIInsightsCard";
import { RiskPredictionCard } from "@/components/analytics/RiskPredictionCard";
import { DeliveryForecastCard } from "@/components/analytics/DeliveryForecastCard";
import { RecentAIEvents } from "@/components/analytics/RecentAIEvents";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  return (
    <AppLayout>
      <div className="w-full h-full pb-16">
        <AnalyticsHeader />
        
        {isLoading || !data ? (
          <AnalyticsSkeleton />
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* KPI Cards Row */}
            <KPIGrid kpis={data.kpis} />

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <ProductivityChart data={data.productivity} />
              </div>
              <div className="xl:col-span-1">
                <ProjectStatusChart data={data.projectStatus} />
              </div>
            </div>

            {/* Sprint & Delivery Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SprintVelocityChart data={data.sprintVelocity} />
              <BurndownChart data={data.burndown} />
            </div>

            {/* AI Insights & Forecasting Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-1">
                <RiskPredictionCard risk={data.riskPrediction} />
              </div>
              <div className="xl:col-span-1">
                <DeliveryForecastCard forecast={data.deliveryForecast} />
              </div>
              <div className="xl:col-span-2">
                <AIInsightsCard insights={data.aiInsights} />
              </div>
            </div>

            {/* Table & Timeline Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <TeamPerformanceTable data={data.teamPerformance} />
              </div>
              <div className="xl:col-span-1">
                <RecentAIEvents events={data.recentAIEvents} />
              </div>
            </div>

          </div>
        )}
      </div>
    </AppLayout>
  );
}
