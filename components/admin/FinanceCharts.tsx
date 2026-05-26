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
} from "recharts";

interface FinanceChartProps {
  data: any[];
}

export function SalesTrendChart({ data }: FinanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7BB32E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7BB32E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgba(0,0,0,0.05)"
        />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fontWeight: 700, fill: "#888" }}
          tickFormatter={(val) => val.split("-")[2]}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fontWeight: 700, fill: "#888" }}
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 20,
            border: "none",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            fontWeight: 800,
          }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#7BB32E"
          strokeWidth={4}
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
