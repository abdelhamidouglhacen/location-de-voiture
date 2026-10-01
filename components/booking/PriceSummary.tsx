import Image from "next/image";
import { CountUp } from "@/components/animations/CountUp";
import { formatDateTime, formatMAD } from "@/lib/format";
import type { PriceBreakdown } from "@/lib/price";
import type { Car, Extra } from "@/types";

interface Props {
  car: Car;
  price: PriceBreakdown;
  extras: Extra[];
  depart: Date;
  retour: Date;
  action?: React.ReactNode;
}

export function PriceSummary({ car, price, extras, depart, retour, action }: Props) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
      <div className="relative aspect-[16/9] bg-sand">
        <Image src={car.images[0]} alt="" fill sizes="360px" className="object-cover" />
      </div>
      <div className="p-5">
        <p className="text-xs font-medium tracking-[0.12em] text-accent-deep uppercase">{car.categorie}</p>
        <h2 className="mt-1 font-display text-lg font-semibold tracking-tight">
          {car.marque} {car.modele}
        </h2>

        <dl className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-sand p-4 text-sm">
          <div>
            <dt className="text-muted">Pick-up</dt>
            <dd className="font-medium tabular-nums">{formatDateTime(depart)}</dd>
          </div>
          <div>
            <dt className="text-muted">Return</dt>
            <dd className="font-medium tabular-nums">{formatDateTime(retour)}</dd>
          </div>
        </dl>
        {action && <div className="mt-3">{action}</div>}

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">
              {formatMAD(car.prixParJour)} × {price.jours} day{price.jours > 1 ? "s" : ""}
            </dt>
            <dd className="tabular-nums">{formatMAD(price.sousTotal)}</dd>
          </div>
          {price.remise > 0 && (
            <div className="flex justify-between gap-3 text-emerald-700">
              <dt>Long-rental discount</dt>
              <dd className="tabular-nums">− {formatMAD(price.remise)}</dd>
            </div>
          )}
          {extras.map((e) => (
            <div key={e.id} className="flex justify-between gap-3">
              <dt className="text-muted">{e.nom}</dt>
              <dd className="tabular-nums">{formatMAD(e.unite === "jour" ? e.prix * price.jours : e.prix)}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
            <dt className="font-medium">Estimated total</dt>
            <dd className="font-display text-2xl font-semibold tabular-nums">
              <CountUp value={price.total} format="mad" duration={0.5} />
            </dd>
          </div>
          <div className="flex justify-between gap-3 text-xs text-muted">
            <dt>Deposit (returned at drop-off)</dt>
            <dd className="tabular-nums">{formatMAD(car.caution)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
