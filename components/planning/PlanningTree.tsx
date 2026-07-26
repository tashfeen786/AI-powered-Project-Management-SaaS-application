import { MilestoneData } from "@/features/planning/mock-data";
import { MilestoneCard } from "./MilestoneCard";

export function PlanningTree({ milestones }: { milestones: MilestoneData[] }) {
  return (
    <div className="mt-6">
      {milestones.map(milestone => (
        <MilestoneCard key={milestone.id} milestone={milestone} />
      ))}
    </div>
  );
}
