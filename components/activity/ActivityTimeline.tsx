"use client";

import { ActivityLog } from "@/features/activity/mock-data";
import { ActivityItem } from "./ActivityItem";
import { motion } from "framer-motion";

export function ActivityTimeline({ activities }: { activities: ActivityLog[] }) {
  return (
    <div className="relative ml-4 mt-6">
      <div className="absolute top-0 bottom-0 left-[15px] w-px bg-border"></div>
      
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <ActivityItem activity={activity} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
