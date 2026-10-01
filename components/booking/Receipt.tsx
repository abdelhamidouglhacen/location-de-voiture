import { LogoMark } from "@/components/site/Logo";
import { BUSINESS } from "@/lib/constants";
import { formatDate, formatDateTime, formatMAD } from "@/lib/format";
import type { PriceBreakdown } from "@/lib/price";
import type { Car, DriverInfo, Extra } from "@/types";

export interface RequestSummary {
  reference: string;
  car: Car;
  driver: DriverInfo;
  depart: Date;
  retour: Date;
  lieuDepart: string;
  lieuRetour: string;
  options: Extra[];
  price: PriceBreakdown;
}

export function Receipt({ reference, car, driver, depart, retour, lieuDepart, lieuRetour, options, price }: RequestSummary) {
  const rows: [string, string][] = [
    ["Conducteur", driver.nomComplet],
    ["Téléphone", driver.telephone],
    ["E-mail", driver.email],
    ["Voiture", `${car.marque} ${car.modele} (${car.annee})`],
    ["Départ", `${formatDateTime(depart)}, ${lieuDepart}`],
    ["Retour", `${formatDateTime(retour)}, ${lieuRetour}`],
  ];
  if (driver.numeroVol) rows.push(["Vol", driver.numeroVol]);

  return (
    <article className="print-area rounded-[20px] border border-line bg-surface p-6 sm:p-8" aria-label="Récapitulatif de la demande">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-center gap-4">
          <LogoMark size={56} />
          <div className="text-sm">
            <p className="font-display font-semibold tracking-[0.06em]">{BUSINESS.name}</p>
            <p className="text-muted">{BUSINESS.address}</p>
            <p className="text-muted tabular-nums">{BUSINESS.phones.map((p) => p.label).join(" / ")}</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="text-muted">Demande</p>
          <p className="font-display text-lg font-semibold tabular-nums">{reference}</p>
          <p className="text-muted">du {formatDate(new Date())}</p>
        </div>
      </header>

      <dl className="grid gap-x-8 gap-y-4 py-6 text-sm sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted">{label}</dt>
            <dd className="mt-0.5 font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <table className="w-full border-t border-line text-sm">
        <caption className="sr-only">Estimation du prix</caption>
        <tbody>
          <tr>
            <th scope="row" className="py-2 text-left font-normal text-muted">
              Location ({price.jours} × {formatMAD(car.prixParJour)})
            </th>
            <td className="py-2 text-right tabular-nums">{formatMAD(price.sousTotal)}</td>
          </tr>
          {price.remise > 0 && (
            <tr>
              <th scope="row" className="py-2 text-left font-normal text-muted">
                Remise longue durée
              </th>
              <td className="py-2 text-right tabular-nums">− {formatMAD(price.remise)}</td>
            </tr>
          )}
          {options.map((o) => (
            <tr key={o.id}>
              <th scope="row" className="py-2 text-left font-normal text-muted">
                {o.nom}
              </th>
              <td className="py-2 text-right tabular-nums">{formatMAD(o.unite === "jour" ? o.prix * price.jours : o.prix)}</td>
            </tr>
          ))}
          <tr className="border-t border-line">
            <th scope="row" className="pt-3 text-left font-medium">
              Total estimé
            </th>
            <td className="pt-3 text-right font-display text-2xl font-semibold tabular-nums">{formatMAD(price.total)}</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
        Caution de {formatMAD(car.caution)} réglée au départ et rendue au retour. Présentez votre permis et votre pièce d&apos;identité au départ.
        Kilométrage illimité, carburant plein / plein.
      </p>
    </article>
  );
}
