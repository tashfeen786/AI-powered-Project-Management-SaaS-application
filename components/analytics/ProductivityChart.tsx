"use client";

import { ChartDataPoint } from "@/features/analytics/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ProductivityChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-6">Weekly Productivity</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: '6px', fontSize: '12px' }}
              itemStyle={{ color: '#171717', fontWeight: 500 }}
            />
            <Area type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
