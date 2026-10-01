import { Clock, HandCoins, KeyRound, MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { FadeUp } from "@/components/animations/FadeUp";
import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cars } from "@/lib/data/cars";
import { locations } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "À propos",
  description: "AZUR DRIVE, agence de location de voitures à Agadir : une flotte récente, un service 24h/24 et la livraison à l'aéroport ou à l'hôtel.",
};

const values = [
  {
    Icon: Clock,
    title: "Disponibles à toute heure",
    text: "Un vol qui arrive à 3h du matin ne devrait pas être un problème. Nous répondons au téléphone jour et nuit.",
  },
  { Icon: HandCoins, title: "Des prix clairs", text: "Le prix annoncé est le prix payé. Pas de supplément surprise au comptoir." },
  { Icon: Sparkles, title: "Des voitures soignées", text: "Chaque voiture est lavée, vérifiée et remise avec le plein avant chaque location." },
  { Icon: KeyRound, title: "Une remise simple", text: "À l'agence, à l'aéroport Al Massira, à la Marina ou devant votre hôtel." },
];

export default function AboutPage() {
  const stats = [
    { value: `${cars.length}`, label: "voitures récentes" },
    { value: "24h/24", label: "7 jours sur 7" },
    { value: `${locations.length}`, label: "points de remise" },
    { value: "21 ans", label: "âge minimum" },
  ];

  return (
    <>
      <PageHeader title="À propos" text="Une agence de location à Agadir, pensée pour les voyageurs comme pour les Gadiris." crumbs={[{ label: "À propos" }]} />

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <FadeUp className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-sand">
            <Image
              src="/cars/mercedes-classe-c-2.jpg"
              alt="Mercedes Classe C de la flotte AZUR DRIVE"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </FadeUp>
          <div>
            <SectionHeading title="Conduisez le meilleur, louez avec nous" />
            <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted">
              <p>
                AZUR DRIVE est une agence de location de voitures installée au centre-ville d&apos;Agadir. Nous louons des citadines, des SUV, des voitures
                de luxe et des vans, pour quelques jours ou plusieurs semaines.
              </p>
              <p>
                Notre idée est simple : une voiture propre, un prix connu à l&apos;avance et quelqu&apos;un qui décroche le téléphone, même la nuit. Nous
                livrons à l&apos;aéroport Al Massira, à la Marina et dans les hôtels d&apos;Agadir et de Taghazout.
              </p>
            </div>
            <Button href="/voitures" className="mt-8">
              Voir nos voitures
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface" aria-label="AZUR DRIVE en chiffres">
        <FadeUp>
          <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-line lg:grid-cols-4">
            {stats.map((s) => (
              <li key={s.label} className="bg-surface px-4 py-10 sm:px-6">
                <p className="font-display text-4xl font-semibold tracking-[-0.03em] tabular-nums sm:text-5xl">{s.value}</p>
                <p className="mt-2 text-muted">{s.label}</p>
              </li>
            ))}
          </ul>
        </FadeUp>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="valeurs-titre">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="valeurs-titre" title="Ce qui compte pour nous" />
          <StaggerGroup className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {values.map(({ Icon, title, text }) => (
              <div key={title} className="flex gap-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-deep">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </div>
              </div>
            ))}
          </StaggerGroup>
          <FadeUp className="mt-16 flex flex-col items-start gap-4 rounded-[20px] border border-line bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-lg">
              <MapPin className="size-5 text-accent-deep" aria-hidden />
              Passez nous voir au centre-ville d&apos;Agadir, ou appelez-nous.
            </p>
            <Button href="/contact" variant="outline">
              Nous contacter
            </Button>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
