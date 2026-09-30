"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, ChartTooltip, gridProps } from "./chart";

export function BookingsChart({ data, height = 280 }: { data: { label: string; total: number }[]; height?: number }) {
  return (
    <div className="text-muted" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} minTickGap={16} tickFormatter={(m: string) => m.replace(".", "")} />
          <YAxis {...axisProps} allowDecimals={false} width={48} />
          <Tooltip content={(p) => <ChartTooltip {...p} unit="reservations" />} cursor={{ fill: "#C9A24A", fillOpacity: 0.08 }} />
          <Bar animationDuration={800} dataKey="total" name="Réservations" fill="#86661C" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
