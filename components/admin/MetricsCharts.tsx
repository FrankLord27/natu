'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#7BB32E', '#2B5A06', '#A9D669', '#1a1a1a', '#666'];

interface ChartProps {
  data: any[];
}

export function MonthlyPerformanceChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7BB32E" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#7BB32E" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
        <Tooltip 
          contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
        />
        <Legend iconType="circle" />
        <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="#7BB32E" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
        <Area type="monotone" dataKey="cost" name="Costos" stroke="#333" strokeWidth={3} fillOpacity={0.1} fill="#333" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryShareChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={80}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ProfitMarginChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
        <Tooltip cursor={{fill: '#f8f8f8'}} />
        <Bar dataKey="profit" name="Beneficio ($)" fill="#7BB32E" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
