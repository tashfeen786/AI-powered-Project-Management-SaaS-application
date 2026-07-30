import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
}

export function SidebarItem({ icon: Icon, label, href, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "flex items-center w-full gap-3 p-2 md:justify-center lg:justify-start lg:px-3 lg:py-2 rounded-md text-sm transition-colors duration-150",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-text-secondary hover:bg-background hover:text-text-primary"
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="truncate md:hidden lg:block">{label}</span>
    </Link>
  );
}
