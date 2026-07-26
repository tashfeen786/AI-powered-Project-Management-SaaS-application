"use client";

import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export function KPICard({ title, value, trend, trendDirection, delay = 0 }: KPICardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className="bg-surface border border-border rounded-lg p-5 flex flex-col justify-between"
    >
      <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        {trend && (
          <div className={`text-xs font-medium px-1.5 py-0.5 rounded ${
            trendDirection === 'up' ? 'text-success bg-success/10' : 
            trendDirection === 'down' ? 'text-danger bg-danger/10' : 
            'text-text-secondary bg-border'
          }`}>
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  );
}
