import Image from "next/image";
import Link from "next/link";
import { ReserveDialog } from "@/components/booking/ReserveDialog";
import { Button } from "@/components/ui/Button";
import { formatMAD } from "@/lib/format";
import { calculateDays, calculatePrice } from "@/lib/price";
import type { RentalSearch } from "@/lib/search";
import type { Car } from "@/types";
import { CarSpecs } from "./CarSpecs";

export function CarCard({ car, priority, search }: { car: Car; priority?: boolean; search?: RentalSearch }) {
  const name = `${car.marque} ${car.modele}`;
  const period = search && calculatePrice(car, calculateDays(search.depart, search.retour), []);
  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-lift">
      <Link href={`/voitures/${car.id}`} className="relative block aspect-[16/10] overflow-hidden bg-sand" tabIndex={-1} aria-hidden>
        <Image
          src={car.images[0]}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium tracking-[0.12em] text-accent-deep uppercase">{car.categorie}</p>
        <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight">
          <Link href={`/voitures/${car.id}`} className="hover:text-ink-2">
            {name}
          </Link>
          <span className="ml-2 font-sans text-sm font-normal text-muted">{car.annee}</span>
        </h3>
        <div className="mt-3 mb-5">
          <CarSpecs car={car} />
        </div>
        <div className="mt-auto border-t border-line pt-4">
          {period ? (
            <p className="leading-none">
              <span className="font-display text-xl font-semibold tabular-nums">{formatMAD(period.total)}</span>
              <span className="ml-1 text-sm text-muted">
                pour {period.jours} jour{period.jours > 1 ? "s" : ""}
              </span>
              <span className="mt-1.5 block text-xs text-muted tabular-nums">soit {formatMAD(period.total / period.jours)} / jour</span>
            </p>
          ) : (
            <p className="leading-none">
              <span className="font-display text-xl font-semibold tabular-nums">{formatMAD(car.prixParJour)}</span>
              <span className="ml-1 text-sm text-muted">/ jour</span>
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button href={`/voitures/${car.id}`} variant="outline" size="sm" aria-label={`Détails de la ${name}`}>
              Détails
            </Button>
            <ReserveDialog
              car={{ id: car.id, name, prixParJour: car.prixParJour }}
              className="w-full"
              initial={search && { depart: search.depart, retour: search.retour }}
              places={search && { lieuDepart: search.lieuDepart, lieuRetour: search.lieuRetour }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
