import { ArrowUpRight, BadgeCheck, CarFront, Clock, Phone, Plane } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/animations/FadeUp";
import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CarCard } from "@/components/site/CarCard";
import { Faq } from "@/components/site/Faq";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SwipeGuard } from "@/components/site/SwipeGuard";
import { Testimonials } from "@/components/site/Testimonials";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { BUSINESS, SITE_TITLE, whatsappLink } from "@/lib/constants";
import { cars } from "@/lib/data/cars";

export const metadata: Metadata = { title: { absolute: SITE_TITLE } };

const FEATURED = ["mercedes-gle", "range-rover-evoque", "hyundai-tucson", "dacia-duster", "renault-clio", "vw-t-roc"];

const promises = [
  { Icon: Clock, title: "Service 24h/24", text: "Départ ou retour à toute heure, tous les jours." },
  { Icon: Plane, title: "Livraison aéroport", text: "Votre voiture vous attend à Al Massira." },
  { Icon: BadgeCheck, title: "Sans frais cachés", text: "Prix annoncé, prix payé. Kilométrage illimité." },
  { Icon: CarFront, title: "Voitures récentes", text: "Modèles 2022 à 2024, entretenus et nettoyés." },
];

const categories = [
  { name: "Luxe", image: "/cars/mercedes-gle-2.jpg", text: "Mercedes, Range Rover, BMW", className: "md:col-span-2 md:row-span-2" },
  { name: "SUV", image: "/cars/hyundai-tucson-3.jpg", text: "Tucson, Sportage, Duster" },
  { name: "Citadine", image: "/cars/renault-clio-2.jpg", text: "Clio, 208, Yaris" },
  { name: "Économique", image: "/cars/dacia-sandero-3.jpg", text: "Dès 250 MAD / jour" },
  { name: "Van", image: "/cars/peugeot-rifter-2.jpg", text: "7 à 9 places" },
];

export default function HomePage() {
  const featured = FEATURED.map((id) => cars.find((c) => c.id === id)!);

  return (
    <>
      <Hero />

      <section aria-label="Nos engagements" className="border-y border-line bg-surface">
        <FadeUp>
          <ul className="mx-auto grid max-w-7xl gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-4 bg-surface px-4 py-7 sm:px-6">
                <Icon className="mt-0.5 size-5 shrink-0 text-gold-deep" strokeWidth={1.75} aria-hidden />
                <div>
                  <h2 className="font-medium">{title}</h2>
                  <p className="mt-1 text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </FadeUp>
      </section>

      <section className="py-20 sm:py-28" aria-labelledby="vedette-titre">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="vedette-titre" title="La flotte du moment" text="Cliquez sur « Réserver », choisissez vos dates, c'est tout." />
            <Button href="/voitures" variant="outline">
              Toute la flotte
              <ArrowUpRight className="size-4" aria-hidden />
            </Button>
          </div>
          <SwipeGuard>
            <StaggerGroup className="-mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
              {featured.map((car) => (
                <div key={car.id} className="flex w-[82%] shrink-0 snap-start sm:w-auto [&>article]:w-full">
                  <CarCard car={car} />
                </div>
              ))}
            </StaggerGroup>
          </SwipeGuard>
        </div>
      </section>

      <section className="pb-20 sm:pb-28" aria-labelledby="categories-titre">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="categories-titre" title="Une voiture pour chaque trajet" text="Du centre-ville aux pistes de l'Anti-Atlas." />
          <StaggerGroup className="mt-12 grid auto-rows-[220px] gap-4 md:auto-rows-[240px] md:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/voitures?categorie=${encodeURIComponent(c.name)}`}
                className={cn("group relative overflow-hidden rounded-[20px] bg-sand", c.className)}
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-white">{c.name}</h3>
                    <p className="mt-1 text-sm text-white/80">{c.text}</p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:rotate-45">
                    <ArrowUpRight className="size-4.5" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <Faq />

      <section className="pb-24" aria-labelledby="cta-titre">
        <FadeUp className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 rounded-[28px] border border-line bg-surface p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <h2 id="cta-titre" className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Besoin d&apos;une voiture maintenant ?
              </h2>
              <p className="mt-3 max-w-md text-muted">Appelez-nous, on répond jour et nuit. Livraison possible en moins d&apos;une heure à Agadir.</p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              {BUSINESS.phones.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="inline-flex items-center gap-3 font-display text-2xl font-semibold tabular-nums transition hover:text-gold-deep sm:text-3xl"
                >
                  <Phone className="size-5 text-gold-deep" aria-hidden />
                  {p.label}
                </a>
              ))}
              <Button
                href={whatsappLink("Bonjour, j'ai besoin d'une voiture rapidement.")}
                target="_blank"
                rel="noopener noreferrer"
                variant="gold"
                className="mt-2"
              >
                <WhatsAppIcon className="size-4.5" />
                Écrire sur WhatsApp
              </Button>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
