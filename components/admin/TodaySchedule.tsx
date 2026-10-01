import { ArrowDownLeft, ArrowUpRight, CalendarCheck } from "lucide-react";
import Link from "next/link";
import type { BookingRow } from "@/lib/data/admin";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/format";

interface Item {
  type: "Pick-up" | "Return";
  heure: string;
  booking: BookingRow;
}

export function TodaySchedule({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center text-muted">
        <CalendarCheck className="size-6" aria-hidden />
        <p className="mt-3 text-sm">No pick-ups or returns scheduled today.</p>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-line">
      {items.map(({ type, heure, booking: b }) => (
        <li key={`${type}-${b.id}`}>
          <Link href={`/admin/reservations/${b.id}`} className="-mx-2 flex items-center gap-4 rounded-xl px-2 py-3 transition hover:bg-paper">
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", type === "Pick-up" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700")}>
              {type === "Pick-up" ? <ArrowUpRight className="size-4" aria-hidden /> : <ArrowDownLeft className="size-4" aria-hidden />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">
                {b.customer.nomComplet} · {b.car.marque} {b.car.modele}
              </span>
              <span className="text-sm text-muted">{type}</span>
            </span>
            <span className="font-display text-sm font-semibold tabular-nums">{formatTime(heure)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
