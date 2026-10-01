import { Briefcase, Calendar, Check, Cog, DoorOpen, Fuel, Palette, ShieldCheck, Snowflake, Users } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FadeUp } from "@/components/animations/FadeUp";
import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { ReserveDialog } from "@/components/booking/ReserveDialog";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CarCard } from "@/components/site/CarCard";
import { CarGallery } from "@/components/site/CarGallery";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/constants";
import { cars } from "@/lib/data/cars";
import { formatMAD } from "@/lib/format";

interface Props {
  params: Promise<{ id: string }>;
}

const findCar = (id: string) => cars.find((c) => c.id === id);

export function generateStaticParams() {
  return cars.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = findCar((await params).id);
  if (!car) return { title: "Voiture introuvable" };
  return {
    title: `${car.marque} ${car.modele} à louer à Agadir`,
    description: `Louez la ${car.marque} ${car.modele} ${car.annee} (${car.boite.toLowerCase()}, ${car.carburant.toLowerCase()}) à Agadir dès ${formatMAD(car.prixParJour)} par jour.`,
  };
}

export default async function CarDetailsPage({ params }: Props) {
  const car = findCar((await params).id);
  if (!car) notFound();
  const name = `${car.marque} ${car.modele}`;
  const similar = cars.filter((c) => c.categorie === car.categorie && c.id !== car.id).slice(0, 3);

  const specs = [
    { Icon: Users, label: "Places", value: car.places },
    { Icon: Cog, label: "Boîte", value: car.boite },
    { Icon: Fuel, label: "Carburant", value: car.carburant },
    { Icon: DoorOpen, label: "Portes", value: car.portes },
    { Icon: Briefcase, label: "Bagages", value: `${car.bagages} valises` },
    { Icon: Snowflake, label: "Climatisation", value: car.climatisation ? "Oui" : "Non" },
    { Icon: Calendar, label: "Année", value: car.annee },
    { Icon: Palette, label: "Couleur", value: car.couleur },
  ];

  const conditions = [
    { label: "Âge minimum", value: "21 ans" },
    { label: "Permis", value: "2 ans minimum" },
    { label: "Caution", value: formatMAD(car.caution) },
    { label: "Kilométrage", value: "Illimité" },
    { label: "Carburant", value: "Plein / plein" },
  ];

  return (
    <>
      <PageHeader
        title={name}
        text={`${car.categorie} · ${car.annee} · ${car.boite}`}
        crumbs={[{ href: "/voitures", label: "Nos voitures" }, { label: name }]}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:py-16">
        <div className="min-w-0 space-y-14">
          <CarGallery images={car.images} name={name} />

          <section aria-labelledby="caracteristiques">
            <h2 id="caracteristiques" className="font-display text-2xl font-semibold tracking-tight">
              Caractéristiques
            </h2>
            <FadeUp className="mt-6">
              <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-4">
                {specs.map(({ Icon, label, value }) => (
                  <li key={label} className="bg-surface p-5">
                    <Icon className="size-4.5 text-accent-deep" strokeWidth={1.75} aria-hidden />
                    <p className="mt-4 text-xs text-muted">{label}</p>
                    <p className="mt-0.5 font-medium">{value}</p>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </section>

          <FadeUp>
            <section aria-labelledby="equipements">
              <h2 id="equipements" className="font-display text-2xl font-semibold tracking-tight">
                Équipements
              </h2>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {car.equipements.map((e) => (
                  <li key={e} className="flex items-center gap-3 text-ink-2">
                    <Check className="size-4 shrink-0 text-accent-deep" aria-hidden />
                    {e}
                  </li>
                ))}
              </ul>
            </section>
          </FadeUp>

          <FadeUp>
            <section aria-labelledby="conditions">
              <h2 id="conditions" className="font-display text-2xl font-semibold tracking-tight">
                Conditions de location
              </h2>
              <dl className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {conditions.map((c) => (
                  <div key={c.label} className="rounded-2xl bg-sand p-4">
                    <dt className="text-xs text-muted">{c.label}</dt>
                    <dd className="mt-1 font-medium">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </FadeUp>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Réserver cette voiture">
          <div className="rounded-[20px] border border-line bg-surface p-6 shadow-card">
            <p className="leading-none">
              <span className="font-display text-3xl font-semibold tabular-nums">{formatMAD(car.prixParJour)}</span>
              <span className="ml-1.5 text-muted">/ jour</span>
            </p>
            <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Dès 7 jours</dt>
                <dd className="font-medium tabular-nums">{formatMAD(car.prixParSemaine / 7)} / jour</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Dès 30 jours</dt>
                <dd className="font-medium tabular-nums">{formatMAD(car.prixParMois / 30)} / jour</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Caution</dt>
                <dd className="font-medium tabular-nums">{formatMAD(car.caution)}</dd>
              </div>
            </dl>
            {car.statut === "En maintenance" ? (
              <p className="mt-6 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-900">
                Cette voiture est en maintenance. Appelez-nous pour connaître sa date de retour.
              </p>
            ) : (
              <ReserveDialog car={{ id: car.id, name, prixParJour: car.prixParJour }} label="Choisir mes dates" size="lg" className="mt-6 w-full" />
            )}
            <Button
              href={whatsappLink(`Bonjour, je suis intéressé(e) par la ${name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
              className="mt-3 w-full"
            >
              <WhatsAppIcon className="size-4.5 text-[#1FA855]" />
              Une question ?
            </Button>
            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
              <ShieldCheck className="size-4 text-accent-deep" aria-hidden />
              Annulation gratuite jusqu&apos;à 48h avant le départ
            </p>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="border-t border-line py-16 sm:py-20" aria-labelledby="similaires">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 id="similaires" className="font-display text-3xl font-semibold tracking-[-0.03em]">
              Voitures similaires
            </h2>
            <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c) => (
                <CarCard key={c.id} car={c} />
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}
    </>
  );
}
