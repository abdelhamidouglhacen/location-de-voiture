import { Star } from "lucide-react";
import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { SectionHeading } from "./SectionHeading";

const reviews = [
  { name: "Claire Dubois", origin: "Lyon, France", text: "Car delivered to the airport at 2 a.m., clean and with a full tank. Nothing to complain about, we will be back." },
  { name: "Mehdi Ouazzani", origin: "Casablanca, Morocco", text: "An almost new Tucson for a week in Taghazout. The price quoted was the price paid, no surprises." },
  { name: "Hans Müller", origin: "Munich, Germany", text: "Very good communication on WhatsApp. The deposit was returned the same day we brought the car back." },
  { name: "Salma Bennani", origin: "Agadir, Morocco", text: "I rented a Clio for a weekend, fast service and a very polite team. I recommend them." },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="avis-titre">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="avis-titre" title="What our customers say" text="Travellers from around the world and Agadir locals trust us all year round." />
        <StaggerGroup className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {reviews.map((r) => (
            <figure key={r.name} className="flex w-[82%] shrink-0 snap-start flex-col rounded-[20px] border border-line bg-surface p-6 md:w-auto">
              <div className="flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4.5 fill-current" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-2">“{r.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                <span className="grid size-10 place-items-center rounded-full bg-sand font-display text-xs font-semibold text-ink" aria-hidden>
                  {r.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{r.name}</span>
                  <span className="text-sm text-muted">{r.origin}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
