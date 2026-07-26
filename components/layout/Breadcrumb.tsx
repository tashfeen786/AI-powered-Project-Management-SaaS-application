import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  return (
    <div className="h-10 flex items-center px-4 md:px-6 text-sm bg-background border-b border-border overflow-x-auto whitespace-nowrap">
      <div className="flex items-center text-text-secondary">
        <span className="hover:text-text-primary cursor-pointer transition-colors duration-150">Dashboard</span>
        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
        <span className="hover:text-text-primary cursor-pointer transition-colors duration-150">Projects</span>
        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
        <span className="hover:text-text-primary cursor-pointer transition-colors duration-150">Inventory System</span>
        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
        <span className="text-text-primary font-medium">Requirements</span>
      </div>
    </div>
  );
}
