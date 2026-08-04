import { Sparkles, Calendar, Bot, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface AIFeaturesProps {
  projectId: string;
  onGenerateSRSClick: () => void;
  onSprintWizardClick: () => void;
}

export function AIFeatures({ projectId, onGenerateSRSClick, onSprintWizardClick }: AIFeaturesProps) {
  const router = useRouter();

  const features = [
    { title: "AI Copilot", icon: MessageSquare, onClick: () => router.push(`/projects/${projectId}/copilot`) },
    { title: "AI Agents", icon: Bot, onClick: () => router.push(`/projects/${projectId}/agents`) },
    { title: "Generate SRS", icon: Sparkles, onClick: onGenerateSRSClick },
    { title: "Generate Sprint Plan", icon: Calendar, onClick: onSprintWizardClick },
  ];

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-4 relative">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-primary">AI Features</h3>
      </div>
      <div className="flex flex-col gap-2 relative">
        {features.map((feature, i) => (
          <button 
            key={i} 
            onClick={feature.onClick}
            className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm text-text-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-1 focus:ring-primary border border-transparent hover:border-primary/30 group"
          >
            <div className="w-7 h-7 rounded bg-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-surface transition-colors shadow-sm">
              <feature.icon className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">{feature.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
