import { AnalyticsFilters } from "./AnalyticsFilters";

export function AnalyticsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Executive Dashboard</h1>
        <p className="text-sm text-text-secondary">
          AI-powered project insights, team productivity, and delivery forecasting.
        </p>
      </div>
      <AnalyticsFilters />
    </div>
  );
}
