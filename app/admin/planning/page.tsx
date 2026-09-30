"use client";

import { addDays, format, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { BAR_COLORS, PlanningTimeline } from "@/components/admin/PlanningTimeline";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { bookingRows } from "@/lib/data/admin";
import { cars } from "@/lib/data/cars";
import { cn } from "@/lib/cn";

const VIEWS = { semaine: 7, mois: 30 } as const;

export default function PlanningPage() {
  const [view, setView] = useState<keyof typeof VIEWS>("semaine");
  const [start, setStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const days = VIEWS[view];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setStart(addDays(start, -days))} aria-label="Période précédente">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
            Aujourd&apos;hui
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStart(addDays(start, days))} aria-label="Période suivante">
            <ChevronRight className="size-4" />
          </Button>
          <p className="ml-2 font-medium tabular-nums">
            {format(start, "d MMM", { locale: fr })} au {format(addDays(start, days - 1), "d MMM yyyy", { locale: fr })}
          </p>
        </div>
        <Tabs
          label="Vue du planning"
          value={view}
          onChange={(v) => setView(v as keyof typeof VIEWS)}
          tabs={[
            { value: "semaine", label: "Semaine" },
            { value: "mois", label: "Mois" },
          ]}
        />
      </div>

      <ul className="flex flex-wrap gap-4 text-sm text-muted" aria-label="Légende">
        {Object.entries(BAR_COLORS).map(([statut, color]) => (
          <li key={statut} className="inline-flex items-center gap-2">
            <span className={cn("h-3 w-6 rounded ring-1 ring-inset", color)} aria-hidden />
            {statut}
          </li>
        ))}
        <li className="inline-flex items-center gap-2">
          <span className="h-3 w-6 rounded bg-red-100 ring-1 ring-red-300 ring-inset" aria-hidden />
          En retard
        </li>
      </ul>

      <Card padded={false} className="overflow-hidden">
        <PlanningTimeline cars={cars} bookings={bookingRows} start={start} days={days} />
      </Card>
    </div>
  );
}
