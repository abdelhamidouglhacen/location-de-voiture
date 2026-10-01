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
  { Icon: Clock, title: "24/7 service", text: "Pick-up or return at any hour, every day." },
  { Icon: Plane, title: "Airport delivery", text: "Your car is waiting for you at Al Massira." },
  { Icon: BadgeCheck, title: "No hidden fees", text: "The price you see is the price you pay. Unlimited mileage." },
  { Icon: CarFront, title: "Recent cars", text: "2022 to 2024 models, serviced and cleaned." },
];

const categories = [
  { name: "Luxury", image: "/cars/mercedes-gle-2.jpg", text: "Mercedes, Range Rover, BMW", className: "md:col-span-2 md:row-span-2" },
  { name: "SUV", image: "/cars/hyundai-tucson-3.jpg", text: "Tucson, Sportage, Duster" },
  { name: "City", image: "/cars/renault-clio-2.jpg", text: "Clio, 208, Yaris" },
  { name: "Economy", image: "/cars/dacia-sandero-3.jpg", text: "From 250 MAD / day" },
  { name: "Van", image: "/cars/peugeot-rifter-2.jpg", text: "7 to 9 seats" },
];

export default function HomePage() {
  const featured = FEATURED.map((id) => cars.find((c) => c.id === id)!);

  return (
    <>
      <Hero />

      <section aria-label="Our commitments" className="border-y border-line bg-surface">
        <FadeUp>
          <ul className="mx-auto grid max-w-7xl gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-4 bg-surface px-4 py-7 sm:px-6">
                <Icon className="mt-0.5 size-5 shrink-0 text-accent-deep" strokeWidth={1.75} aria-hidden />
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
            <SectionHeading id="vedette-titre" title="Featured cars" text="Click “Book”, choose your dates, and you're done." />
            <Button href="/voitures" variant="outline">
              View all cars
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
          <SectionHeading id="categories-titre" title="A car for every trip" text="From the city centre to the tracks of the Anti-Atlas." />
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
                Need a car right now?
              </h2>
              <p className="mt-3 max-w-md text-muted">Call us, we answer day and night. Delivery in under an hour in Agadir.</p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              {BUSINESS.phones.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="inline-flex items-center gap-3 font-display text-2xl font-semibold tabular-nums transition hover:text-accent-deep sm:text-3xl"
                >
                  <Phone className="size-5 text-accent-deep" aria-hidden />
                  {p.label}
                </a>
              ))}
              <Button
                href={whatsappLink("Hello, I need a car quickly.")}
                target="_blank"
                rel="noopener noreferrer"
                variant="accent"
                className="mt-2"
              >
                <WhatsAppIcon className="size-4.5" />
                Message us on WhatsApp
              </Button>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
