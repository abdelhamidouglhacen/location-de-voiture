import { formatMAD } from "@/lib/format";

/** Shared chart styling: quiet axes, dashed grid and a small tooltip card. */
export const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: "currentColor", fontSize: 12 },
} as const;

export const gridProps = { strokeDasharray: "4 4", stroke: "currentColor", strokeOpacity: 0.12, vertical: false } as const;

export function compactMAD(n: number) {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
}

interface TooltipProps {
  active?: boolean;
  payload?: readonly { value?: unknown; name?: unknown; payload?: Record<string, unknown> }[];
  label?: string | number;
  unit?: "mad" | "reservations";
}

export function ChartTooltip({ active, payload, label, unit = "mad" }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0].value ?? 0);
  const title = label ?? String(payload[0].name ?? "");
  return (
    <div className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm shadow-lift">
      <p className="text-xs text-muted capitalize">{title}</p>
      <p className="font-semibold text-ink tabular-nums">{unit === "mad" ? formatMAD(value) : `${value} réservation${value > 1 ? "s" : ""}`}</p>
    </div>
  );
}
