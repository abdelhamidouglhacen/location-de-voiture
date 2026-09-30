"use client";

import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { HOURS } from "@/lib/constants";
import { formatDate, formatMAD } from "@/lib/format";
import { calculateDays } from "@/lib/price";
import { searchQuery, withTime } from "@/lib/search";

export interface ReserveCar {
  id: string;
  name: string;
  prixParJour: number;
}

interface Props {
  car: ReserveCar;
  label?: string;
  variant?: "primary" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  initial?: { depart: Date; retour: Date };
  /** Pickup and return places chosen earlier, passed on to the booking form. */
  places?: { lieuDepart?: string; lieuRetour?: string };
}

function useMonths() {
  const [months, setMonths] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setMonths(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return months;
}

/** "Réserver" button: opens a calendar, then sends the visitor to the booking form with the chosen dates. */
export function ReserveDialog({ car, label = "Réserver", variant = "primary", size = "sm", className, initial, places }: Props) {
  const router = useRouter();
  const months = useMonths();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(initial ? { from: initial.depart, to: initial.retour } : undefined);
  const [heureDepart, setHeureDepart] = useState(initial ? format(initial.depart, "HH:mm") : "10:00");
  const [heureRetour, setHeureRetour] = useState(initial ? format(initial.retour, "HH:mm") : "10:00");
  const [error, setError] = useState<string>();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const depart = range?.from && withTime(range.from, heureDepart);
  const retour = range?.to && withTime(range.to, heureRetour);
  const valid = depart && retour && retour > depart;
  const days = valid ? calculateDays(depart, retour) : 0;
  const hourOptions = HOURS.map((h) => ({ value: h, label: h }));

  function next() {
    if (!depart || !retour) return setError("Choisissez le jour de départ puis le jour de retour.");
    if (!valid) return setError("L'heure de retour doit être après l'heure de départ.");
    router.push(`/reservation?voiture=${car.id}&${searchQuery({ depart, retour, ...places })}`);
  }

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)} aria-label={`${label} : ${car.name}`}>
        {label}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={car.name}
        description="Choisissez vos dates de location."
        size="lg"
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              {valid ? (
                <>
                  {days} jour{days > 1 ? "s" : ""} · à partir de <strong className="text-ink">{formatMAD(car.prixParJour * days)}</strong>
                </>
              ) : (
                `${formatMAD(car.prixParJour)} / jour`
              )}
            </p>
            <Button onClick={next} disabled={!range?.from}>
              Continuer
            </Button>
          </div>
        }
      >
        <div className="flex justify-center">
          <DayPicker
            mode="range"
            locale={fr}
            numberOfMonths={months}
            selected={range}
            onSelect={(r) => {
              setError(undefined);
              setRange(r);
            }}
            disabled={{ before: today }}
            startMonth={today}
            defaultMonth={range?.from ?? today}
            excludeDisabled
          />
        </div>

        <div className="mt-4 grid gap-4 border-t border-line pt-5 sm:grid-cols-[1fr_1fr_1fr] sm:items-end">
          <div className="flex items-center gap-3 text-sm sm:col-span-1">
            <CalendarDays className="size-5 shrink-0 text-gold-deep" aria-hidden />
            <span>
              <span className="block text-muted">Période</span>
              <span className="font-medium">
                {range?.from ? `${formatDate(range.from)} → ${range.to ? formatDate(range.to) : "…"}` : "Aucune date"}
              </span>
            </span>
          </div>
          <Select id={`hd-${car.id}`} label="Heure de départ" options={hourOptions} value={heureDepart} onChange={(e) => setHeureDepart(e.target.value)} />
          <Select id={`hr-${car.id}`} label="Heure de retour" options={hourOptions} value={heureRetour} onChange={(e) => setHeureRetour(e.target.value)} />
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted">
          <Clock className="size-3.5" aria-hidden />
          Départ et retour possibles à toute heure, 7 jours sur 7.
        </p>
        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}
      </Modal>
    </>
  );
}
