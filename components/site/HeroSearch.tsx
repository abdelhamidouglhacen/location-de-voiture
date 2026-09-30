"use client";

import { ChevronDown, Clock, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateField } from "@/components/booking/DateField";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { HOURS } from "@/lib/constants";
import { locations } from "@/lib/data/locations";
import { searchQuery, withTime } from "@/lib/search";

type Leg = { lieu: string; date?: Date; heure: string };

interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon: React.ReactNode;
}

function IconSelect({ id, label, value, onChange, options, icon }: SelectProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gold-deep">{icon}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full cursor-pointer appearance-none truncate rounded-xl border border-line bg-surface pr-9 pl-9 text-[15px] transition hover:border-ink/30 focus:border-ink focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  );
}

const placeOptions = locations.map((l) => ({ value: l.id, label: l.nom }));
const hourOptions = HOURS.map((h) => ({ value: h, label: h }));

/** Rental search. "card" floats in the desktop hero; "sheet" sits inside the mobile pop-up. */
export function HeroSearch({ variant = "card" }: { variant?: "card" | "sheet" }) {
  const router = useRouter();
  const sheet = variant === "sheet";
  const [depart, setDepart] = useState<Leg>({ lieu: locations[0].id, heure: "10:00" });
  const [retour, setRetour] = useState<Leg>({ lieu: locations[0].id, heure: "10:00" });
  const [errors, setErrors] = useState<{ depart?: string; retour?: string }>({});

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = {
      depart: depart.date ? undefined : "Choisissez la date de départ",
      retour: retour.date ? undefined : "Choisissez la date de retour",
    };
    if (depart.date && retour.date && withTime(retour.date, retour.heure) <= withTime(depart.date, depart.heure)) {
      found.retour = "Le retour doit être après le départ";
    }
    setErrors(found);
    if (found.depart || found.retour) return;
    const query = searchQuery({
      depart: withTime(depart.date!, depart.heure),
      retour: withTime(retour.date!, retour.heure),
      lieuDepart: depart.lieu,
      lieuRetour: retour.lieu,
    });
    router.push(`/voitures?${query}`);
  }

  const leg = (key: "depart" | "retour", title: string, value: Leg, set: (v: Leg) => void) => (
    <fieldset className="min-w-0">
      <legend className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
        <span className={key === "depart" ? "size-2 rounded-full bg-gold" : "size-2 rounded-full border-2 border-gold"} aria-hidden />
        {title}
      </legend>
      <div className={cn("grid gap-2.5", !sheet && "grid-cols-[1fr_128px]")}>
        <div className={cn(!sheet && "col-span-2")}>
          <IconSelect
            id={`${variant}-lieu-${key}`}
            label={key === "depart" ? "Lieu de départ" : "Lieu de destination"}
            value={value.lieu}
            onChange={(lieu) => set({ ...value, lieu })}
            options={placeOptions}
            icon={<MapPin className="size-4" aria-hidden />}
          />
        </div>
        <DateField
          id={`${variant}-date-${key}`}
          label={key === "depart" ? "Date de départ" : "Date de retour"}
          hideLabel
          inline={sheet}
          up={!sheet && key === "retour"}
          value={value.date}
          minDate={key === "retour" && depart.date ? depart.date : today}
          error={errors[key]}
          onChange={(date) => {
            setErrors({ ...errors, [key]: undefined });
            if (key === "depart" && retour.date && retour.date < date) setRetour({ ...retour, date: undefined });
            set({ ...value, date });
          }}
        />
        <IconSelect
          id={`${variant}-heure-${key}`}
          label={key === "depart" ? "Heure de départ" : "Heure de retour"}
          value={value.heure}
          onChange={(heure) => set({ ...value, heure })}
          options={hourOptions}
          icon={<Clock className="size-4" aria-hidden />}
        />
      </div>
    </fieldset>
  );

  return (
    <form onSubmit={submit} noValidate aria-label="Trouvez votre voiture" className={cn(!sheet && "rounded-[24px] bg-surface p-6 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]")}>
      {!sheet && <p className="font-display text-lg font-semibold tracking-tight">Trouvez votre voiture</p>}
      <div className={cn("space-y-5", !sheet && "mt-5")}>
        {leg("depart", "Départ", depart, setDepart)}
        <div className="border-t border-line pt-5">{leg("retour", "Destination", retour, setRetour)}</div>
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full">
        <Search className="size-4" aria-hidden />
        Rechercher
      </Button>
    </form>
  );
}
