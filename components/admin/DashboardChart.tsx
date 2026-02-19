'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardChartProps {
  data: Array<{ date: string, total: number }>;
}

export default function DashboardChart({ data }: DashboardChartProps) {
  return (
    <ResponsiveContainer width="100%" height="200px">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7BB32E" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#7BB32E" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
        <Area type="monotone" dataKey="total" stroke="#7BB32E" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
