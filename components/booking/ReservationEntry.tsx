"use client";

import { useSyncExternalStore } from "react";
import { EmptyState } from "@/components/ui/States";
import { readSearch } from "@/lib/search";
import type { Car, Extra, Location } from "@/types";
import { ReservationForm } from "./ReservationForm";
import { ReserveDialog } from "./ReserveDialog";

const noop = () => () => {};

interface Props {
  car: Car;
  depart?: string;
  retour?: string;
  lieuDepart?: string;
  lieuRetour?: string;
  extras: Extra[];
  locations: Location[];
}

/** Dates are read in the visitor's own time zone, so this renders on the client only. */
export function ReservationEntry({ car, depart, retour, lieuDepart, lieuRetour, extras, locations }: Props) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return <div className="min-h-[60vh]" aria-busy="true" />;

  const params: Record<string, string | undefined> = { depart, retour, lieuDepart, lieuRetour };
  const search = readSearch((key) => params[key]);

  if (!search) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <EmptyState
          title="Choisissez vos dates"
          text={`Indiquez quand vous souhaitez louer la ${car.marque} ${car.modele} pour continuer.`}
          action={<ReserveDialog car={{ id: car.id, name: `${car.marque} ${car.modele}`, prixParJour: car.prixParJour }} label="Ouvrir le calendrier" size="md" />}
        />
      </div>
    );
  }

  return <ReservationForm car={car} search={search} extras={extras} locations={locations} />;
}
