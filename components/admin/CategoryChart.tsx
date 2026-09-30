"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./chart";

/**
 * Brand neutrals and golds, alternating light and dark between neighbours.
 * The shades are close, so the legend carries the names and values.
 */
const COLORS = ["#121212", "#E3D3A6", "#86661C", "#A1A1AA", "#C9A24A"];
const SIZE = 176;
const GAP = 12;

export function CategoryChart({ data }: { data: { name: string; total: number }[] }) {
  const total = data.reduce((s, d) => s + d.total, 0);
  const [active, setActive] = useState<number | null>(null);

  // Recharts draws from 3 o'clock counter-clockwise; place the card just outside the hovered slice.
  let tip: { x: number; y: number; left: boolean } | null = null;
  if (active !== null && total) {
    const before = data.slice(0, active).reduce((s, d) => s + d.total, 0);
    const mid = ((before + data[active].total / 2) / total) * 2 * Math.PI;
    const r = SIZE / 2 + GAP;
    tip = { x: SIZE / 2 + r * Math.cos(mid), y: SIZE / 2 - r * Math.sin(mid), left: Math.cos(mid) < 0 };
  }

  return (
    <div className="grid gap-6">
      <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }} onMouseLeave={() => setActive(null)}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              animationDuration={800}
              data={data}
              dataKey="total"
              nameKey="name"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="#FFFFFF"
              strokeWidth={2}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((d, i) => (
                <Cell key={d.name} fill={COLORS[i % COLORS.length]} opacity={active === null || active === i ? 1 : 0.55} className="transition-opacity" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <p>
            <span className="block font-display text-2xl font-semibold tabular-nums">{total}</span>
            <span className="text-xs text-muted">réservations</span>
          </p>
        </div>
        {tip && active !== null && (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap"
            style={{ left: tip.x, top: tip.y, transform: `translate(${tip.left ? "-100%" : "0"}, -50%)` }}
          >
            <ChartTooltip active payload={[{ value: data[active].total }]} label={data[active].name} unit="reservations" />
          </div>
        )}
      </div>
      <ul className="space-y-2.5 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-3">
            <span className="size-2.5 shrink-0 rounded-full ring-1 ring-line" style={{ background: COLORS[i % COLORS.length] }} aria-hidden />
            <span className="flex-1 text-ink-2">{d.name}</span>
            <span className="font-medium tabular-nums">{d.total}</span>
            <span className="w-10 text-right text-muted tabular-nums">{total ? Math.round((d.total / total) * 100) : 0} %</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
