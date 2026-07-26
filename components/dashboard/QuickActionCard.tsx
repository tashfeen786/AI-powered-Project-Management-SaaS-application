import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function QuickActionCard({ title, description, icon: Icon, onClick }: QuickActionCardProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-start p-4 bg-surface border border-border rounded-lg text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent group"
    >
      <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-surface transition-colors duration-150">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-xs text-text-secondary line-clamp-2">{description}</p>
    </button>
  );
}
