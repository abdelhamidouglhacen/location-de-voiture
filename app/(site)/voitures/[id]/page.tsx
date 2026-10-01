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
  if (!car) return { title: "Car not found" };
  return {
    title: `Rent a ${car.marque} ${car.modele} in Agadir`,
    description: `Rent the ${car.marque} ${car.modele} ${car.annee} (${car.boite.toLowerCase()}, ${car.carburant.toLowerCase()}) in Agadir from ${formatMAD(car.prixParJour)} per day.`,
  };
}

export default async function CarDetailsPage({ params }: Props) {
  const car = findCar((await params).id);
  if (!car) notFound();
  const name = `${car.marque} ${car.modele}`;
  const similar = cars.filter((c) => c.categorie === car.categorie && c.id !== car.id).slice(0, 3);

  const specs = [
    { Icon: Users, label: "Seats", value: car.places },
    { Icon: Cog, label: "Gearbox", value: car.boite },
    { Icon: Fuel, label: "Fuel", value: car.carburant },
    { Icon: DoorOpen, label: "Doors", value: car.portes },
    { Icon: Briefcase, label: "Luggage", value: `${car.bagages} suitcases` },
    { Icon: Snowflake, label: "Air conditioning", value: car.climatisation ? "Yes" : "No" },
    { Icon: Calendar, label: "Year", value: car.annee },
    { Icon: Palette, label: "Colour", value: car.couleur },
  ];

  const conditions = [
    { label: "Minimum age", value: "21 years" },
    { label: "Licence", value: "2 years minimum" },
    { label: "Deposit", value: formatMAD(car.caution) },
    { label: "Mileage", value: "Unlimited" },
    { label: "Fuel", value: "Full to full" },
  ];

  return (
    <>
      <PageHeader
        title={name}
        text={`${car.categorie} · ${car.annee} · ${car.boite}`}
        crumbs={[{ href: "/voitures", label: "Our cars" }, { label: name }]}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:py-16">
        <div className="min-w-0 space-y-14">
          <CarGallery images={car.images} name={name} />

          <section aria-labelledby="caracteristiques">
            <h2 id="caracteristiques" className="font-display text-2xl font-semibold tracking-tight">
              Specifications
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
                Features
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
                Rental terms
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

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Book this car">
          <div className="rounded-[20px] border border-line bg-surface p-6 shadow-card">
            <p className="leading-none">
              <span className="font-display text-3xl font-semibold tabular-nums">{formatMAD(car.prixParJour)}</span>
              <span className="ml-1.5 text-muted">/ day</span>
            </p>
            <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">From 7 days</dt>
                <dd className="font-medium tabular-nums">{formatMAD(car.prixParSemaine / 7)} / day</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">From 30 days</dt>
                <dd className="font-medium tabular-nums">{formatMAD(car.prixParMois / 30)} / day</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Deposit</dt>
                <dd className="font-medium tabular-nums">{formatMAD(car.caution)}</dd>
              </div>
            </dl>
            {car.statut === "In maintenance" ? (
              <p className="mt-6 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-900">
                This car is in maintenance. Call us to find out when it will be back.
              </p>
            ) : (
              <ReserveDialog car={{ id: car.id, name, prixParJour: car.prixParJour }} label="Choose my dates" size="lg" className="mt-6 w-full" />
            )}
            <Button
              href={whatsappLink(`Hello, I am interested in the ${name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
              className="mt-3 w-full"
            >
              <WhatsAppIcon className="size-4.5 text-[#1FA855]" />
              Any questions?
            </Button>
            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
              <ShieldCheck className="size-4 text-accent-deep" aria-hidden />
              Free cancellation up to 48 hours before pick-up
            </p>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="border-t border-line py-16 sm:py-20" aria-labelledby="similaires">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 id="similaires" className="font-display text-3xl font-semibold tracking-[-0.03em]">
              Similar cars
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
