"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, ChartTooltip, compactMAD, gridProps } from "./chart";

export function RevenueChart({ data, height = 280 }: { data: { label: string; total: number }[]; height?: number }) {
  return (
    <div className="text-muted" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A24A" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#C9A24A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} minTickGap={16} tickFormatter={(m: string) => m.replace(".", "")} />
          <YAxis {...axisProps} tickFormatter={compactMAD} width={48} />
          <Tooltip content={(p) => <ChartTooltip {...p} />} cursor={{ stroke: "#86661C", strokeDasharray: "4 4" }} />
          <Area
            animationDuration={800}
            type="monotone"
            dataKey="total"
            name="Revenus"
            stroke="#86661C"
            strokeWidth={2}
            fill="url(#revenue-fill)"
            activeDot={{ r: 5, fill: "#86661C", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
