"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface AccountingChartsProps {
  trends: any[];
}

export function RevenueTrendChart({ trends }: AccountingChartsProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={trends}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7BB32E" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#7BB32E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fontWeight: 600, fill: "#999" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fontWeight: 600, fill: "#999" }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "14px",
            border: "none",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
          itemStyle={{ fontWeight: 800 }}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#7BB32E"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorIncome)"
          name="Ingresos"
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="#f44336"
          strokeWidth={3}
          fill="transparent"
          name="Egresos"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ProfitByMonthChart({ trends }: AccountingChartsProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={trends}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fontWeight: 600, fill: "#999" }}
        />
        <YAxis hide />
        <Tooltip cursor={{ fill: "#f8f8f8" }} />
        <Bar dataKey="profit" radius={[8, 8, 0, 0]} name="Beneficio">
          {trends.map((entry: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.profit >= 0 ? "#7BB32E" : "#f44336"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
