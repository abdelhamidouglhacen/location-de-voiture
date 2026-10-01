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
  title: "About",
  description: "AZUR DRIVE, a car rental agency in Agadir: a recent fleet, 24/7 service and delivery to the airport or your hotel.",
};

const values = [
  {
    Icon: Clock,
    title: "Available at any hour",
    text: "A flight landing at 3 a.m. should not be a problem. We answer the phone day and night.",
  },
  { Icon: HandCoins, title: "Clear prices", text: "The price you see is the price you pay. No surprise charges at the counter." },
  { Icon: Sparkles, title: "Well-kept cars", text: "Every car is washed, checked and handed over with a full tank before each rental." },
  { Icon: KeyRound, title: "Easy handover", text: "At the agency, at Al Massira airport, at the Marina or in front of your hotel." },
];

export default function AboutPage() {
  const stats = [
    { value: `${cars.length}`, label: "recent cars" },
    { value: "24/7", label: "every day of the week" },
    { value: `${locations.length}`, label: "pick-up points" },
    { value: "21", label: "minimum age" },
  ];

  return (
    <>
      <PageHeader title="About" text="A rental agency in Agadir, built for travellers and locals alike." crumbs={[{ label: "About" }]} />

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <FadeUp className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-sand">
            <Image
              src="/cars/mercedes-classe-c-2.jpg"
              alt="Mercedes C-Class from the AZUR DRIVE fleet"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </FadeUp>
          <div>
            <SectionHeading title="Drive the best, rent with us" />
            <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted">
              <p>
                AZUR DRIVE is a car rental agency based in Agadir city centre. We rent city cars, SUVs, luxury cars
                and vans, for a few days or several weeks.
              </p>
              <p>
                Our idea is simple: a clean car, a price known in advance and someone who picks up the phone, even at night. We
                deliver to Al Massira airport, the Marina and hotels in Agadir and Taghazout.
              </p>
            </div>
            <Button href="/voitures" className="mt-8">
              See our cars
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface" aria-label="AZUR DRIVE in numbers">
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
          <SectionHeading id="valeurs-titre" title="What matters to us" />
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
              Visit us in Agadir city centre, or give us a call.
            </p>
            <Button href="/contact" variant="outline">
              Contact us
            </Button>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
