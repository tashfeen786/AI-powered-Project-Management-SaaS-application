import { Sparkles, CheckSquare, Calendar, ShieldAlert, FileText, Users, MessageSquare, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

interface AIFeaturesProps {
  projectId: string;
  onGenerateSRSClick: () => void;
  onSprintWizardClick: () => void;
}

export function AIFeatures({ projectId, onGenerateSRSClick, onSprintWizardClick }: AIFeaturesProps) {
  const router = useRouter();

  const features = [
    { title: "AI Agents", icon: Bot, onClick: () => router.push(`/projects/${projectId}/agents`) },
    { title: "Requirement Generator", icon: Sparkles, onClick: onGenerateSRSClick },
    { title: "Task Breakdown", icon: CheckSquare, onClick: () => router.push(`/projects/${projectId}/board?ai=task-breakdown`) },
    { title: "Sprint Generator", icon: Calendar, onClick: onSprintWizardClick },
    { title: "Risk Analysis", icon: ShieldAlert, onClick: () => router.push(`/projects/${projectId}/planning?ai=risk-analysis`) },
    { title: "Project Summary", icon: FileText, onClick: () => router.push(`/projects/${projectId}/copilot?prompt=Summarize+project+status`) },
    { title: "Meeting Notes", icon: Users, onClick: () => router.push(`/projects/${projectId}/copilot?prompt=Create+meeting+summary`) },
    { title: "Document Chat", icon: MessageSquare, onClick: () => router.push(`/projects/${projectId}/copilot?ai=chat`) },
    { title: "Project Chat", icon: Bot, onClick: () => router.push(`/projects/${projectId}/copilot`) },
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-text-primary">AI Features</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
        {features.map((feature, i) => (
          <button 
            key={i} 
            onClick={feature.onClick}
            className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm text-text-primary hover:bg-background transition-colors focus:outline-none focus:ring-1 focus:ring-primary border border-transparent hover:border-border group"
          >
            <div className="w-7 h-7 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-surface transition-colors">
              <feature.icon className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">{feature.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
