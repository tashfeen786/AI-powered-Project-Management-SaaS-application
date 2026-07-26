import { Menu } from "lucide-react";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { SearchBar } from "./SearchBar";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserMenu } from "./UserMenu";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-14 bg-surface border-b border-border flex items-center px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-text-secondary hover:bg-background hover:text-text-primary rounded-md transition-colors duration-150"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:block w-full max-w-[200px]">
          <OrganizationSwitcher />
        </div>
      </div>

      <div className="flex-1 flex justify-center max-w-md w-full px-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 flex-1 justify-end">
        <NotificationDropdown />
        <UserMenu />
      </div>
    </header>
  );
}
