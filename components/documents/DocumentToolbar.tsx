import { Search, Filter, ArrowUpDown } from "lucide-react";

interface DocumentToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  folderPath: string;
  onFolderChange: (f: string) => void;
  folders: string[];
}

export function DocumentToolbar({ searchQuery, onSearchChange, folderPath, onFolderChange, folders }: DocumentToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search documents..."
          className="w-full h-9 pl-9 pr-4 bg-surface border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select 
          value={folderPath}
          onChange={(e) => onFolderChange(e.target.value)}
          className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary focus:outline-none"
        >
          <option value="root">Root</option>
          {folders.filter(f => f !== 'root').map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <button className="flex-1 sm:flex-none h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center justify-center gap-2 hover:bg-background transition-colors focus:outline-none">
          <ArrowUpDown className="w-4 h-4 text-text-secondary" />
          Sort
        </button>
      </div>
    </div>
  );
}
