"use client";

import { addDays, differenceInMinutes, format, isSameDay, isWeekend, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import type { BookingRow } from "@/lib/data/admin";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import type { Car, StatutReservation } from "@/types";

export const BAR_COLORS: Partial<Record<StatutReservation, string>> = {
  "En attente": "bg-amber-100 text-amber-900 ring-amber-300",
  Confirmée: "bg-blue-100 text-blue-900 ring-blue-300",
  "En cours": "bg-emerald-100 text-emerald-900 ring-emerald-300",
  Terminée: "bg-zinc-100 text-zinc-700 ring-zinc-300",
};

interface Props {
  cars: Car[];
  bookings: BookingRow[];
  start: Date;
  days: number;
}

export function PlanningTimeline({ cars, bookings, start, days }: Props) {
  const from = startOfDay(start);
  const to = addDays(from, days);
  const total = days * 24 * 60;
  const dayList = Array.from({ length: days }, (_, i) => addDays(from, i));
  const today = new Date();
  const colWidth = days > 7 ? 44 : 120;

  const visible = bookings.filter((b) => b.statut !== "Annulée" && (new Date(b.dateRetour) > from || b.statut === "En cours") && new Date(b.dateDepart) < to);

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 180 + days * colWidth }}>
        <div className="sticky top-0 z-10 flex border-b border-line bg-surface">
          <div className="w-[180px] shrink-0 px-4 py-3 text-xs font-medium text-muted">Voiture</div>
          <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` }}>
            {dayList.map((d) => (
              <div
                key={d.toISOString()}
                className={cn(
                  "border-l border-line py-2 text-center text-xs",
                  isSameDay(d, today) ? "bg-gold/15 font-semibold text-gold-deep" : "text-muted",
                )}
              >
                <span className="block capitalize">{format(d, days > 7 ? "EEEEE" : "EEE", { locale: fr })}</span>
                <span className="block font-semibold tabular-nums">{format(d, days > 7 ? "d" : "d MMM", { locale: fr })}</span>
              </div>
            ))}
          </div>
        </div>

        {cars.map((car) => {
          const rows = visible.filter((b) => b.voitureId === car.id);
          return (
            <div key={car.id} className="flex border-b border-line">
              <Link href={`/admin/voitures/${car.id}`} className="w-[180px] shrink-0 px-4 py-3 hover:bg-paper">
                <span className="block truncate text-sm font-medium">
                  {car.marque} {car.modele}
                </span>
                <span className="text-xs text-muted">{car.immatriculation}</span>
              </Link>
              <div className="relative flex-1">
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` }} aria-hidden>
                  {dayList.map((d) => (
                    <div key={d.toISOString()} className={cn("border-l border-line", isWeekend(d) && "bg-paper", isSameDay(d, today) && "bg-gold-soft/60")} />
                  ))}
                </div>
                {car.statut === "En maintenance" && (
                  <div className="absolute inset-y-2 right-1 left-1 grid place-items-center rounded-lg border border-dashed border-orange-400 bg-orange-50 text-xs font-semibold text-orange-800">
                    En maintenance
                  </div>
                )}
                {rows.map((b) => {
                  // An overdue rental stays on the timeline until today.
                  const late = b.statut === "En cours" && new Date(b.dateRetour) < today;
                  const startMin = Math.max(0, differenceInMinutes(new Date(b.dateDepart), from));
                  const endMin = Math.min(total, differenceInMinutes(late ? today : new Date(b.dateRetour), from));
                  if (endMin <= 0) return null;
                  return (
                    <Link
                      key={b.id}
                      href={`/admin/reservations/${b.id}`}
                      title={`${b.reference} · ${b.customer.nomComplet} · ${formatDateTime(b.dateDepart)} → ${formatDateTime(b.dateRetour)} · ${late ? "En retard" : b.statut}`}
                      className={cn(
                        "absolute inset-y-2 flex items-center overflow-hidden rounded-lg px-2 text-xs font-medium whitespace-nowrap ring-1 ring-inset transition hover:brightness-95",
                        late ? "bg-red-100 text-red-900 ring-red-300" : BAR_COLORS[b.statut],
                      )}
                      style={{ left: `${(startMin / total) * 100}%`, width: `max(${((endMin - startMin) / total) * 100}%, 8px)` }}
                    >
                      <span className="truncate">
                        {b.customer.nomComplet}
                        {late && " (en retard)"}
                      </span>
                    </Link>
                  );
                })}
                <div className="h-14" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
