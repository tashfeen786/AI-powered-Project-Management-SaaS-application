"use client";

import { ChartDataPoint } from "@/features/analytics/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export function ProjectStatusChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-6">Project Status</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={String(entry.fill)} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: '6px', fontSize: '12px' }}
              itemStyle={{ color: '#171717', fontWeight: 500 }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
