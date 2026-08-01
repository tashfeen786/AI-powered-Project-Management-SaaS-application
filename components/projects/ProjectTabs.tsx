"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Overview", path: "" },
  { name: "Requirements", path: "/requirements" },
  { name: "Planning", path: "/planning" },
  { name: "Board", path: "/board" },
  { name: "Documents", path: "/documents" },
  { name: "Activity", path: "/activity" }
];

export function ProjectTabs({ children, projectId }: { children?: React.ReactNode, projectId: string }) {
  const pathname = usePathname();
  
  // Determine active tab based on URL path
  const activeTabName = tabs.find(t => 
    t.path ? pathname.endsWith(t.path) : pathname.endsWith(`/projects/${projectId}`)
  )?.name || "Overview";

  return (
    <div>
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-1 overflow-x-auto">
          {tabs.map(tab => {
            const isActive = activeTabName === tab.name;
            return (
              <Link
                key={tab.name}
                href={`/projects/${projectId}${tab.path}`}
                className={cn(
                  "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors relative focus:outline-none",
                  isActive ? "text-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab.name}
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
