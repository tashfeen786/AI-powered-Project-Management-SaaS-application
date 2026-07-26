"use client";

import { ChartDataPoint } from "@/features/analytics/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function BurndownChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-6">Current Sprint Burndown</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: '6px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
            <Line type="monotone" dataKey="ideal" stroke="#A3A3A3" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Ideal Tasks" />
            <Line type="monotone" dataKey="remaining" stroke="#F5A623" strokeWidth={2} activeDot={{ r: 6 }} name="Remaining Tasks" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
