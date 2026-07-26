"use client";

import { ChartDataPoint } from "@/features/analytics/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function SprintVelocityChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-6">Sprint Velocity</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: '6px', fontSize: '12px', color: '#171717' }}
              cursor={{ fill: '#F5F5F5' }}
            />
            <Bar dataKey="velocity" fill="#0070F3" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
