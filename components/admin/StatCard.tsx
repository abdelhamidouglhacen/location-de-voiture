import { CountUp } from "@/components/animations/CountUp";
import { cn } from "@/lib/cn";

interface Props {
  label: string;
  value: number;
  format?: "mad" | "number";
  suffix?: string;
  change?: number;
  hint?: string;
}

export function StatCard({ label, value, format = "number", suffix, change, hint }: Props) {
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] tabular-nums">
        <CountUp value={value} format={format} />
        {suffix && <span className="text-base font-medium text-muted">{suffix}</span>}
      </p>
      {(change !== undefined || hint) && (
        <p className="mt-2 text-xs text-muted">
          {change !== undefined && (
            <span className={cn("mr-1.5 font-medium", change >= 0 ? "text-emerald-700" : "text-red-700")}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(1).replace(".", ",")} %
            </span>
          )}
          {hint}
        </p>
      )}
    </div>
  );
}
