import type { Metadata } from "next";
import { FadeUp } from "@/components/animations/FadeUp";
import { PageHeader } from "@/components/site/PageHeader";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Rental terms",
  description: "AZUR DRIVE rental terms: minimum age, licence, deposit, fuel, cancellation and insurance.",
};

const sections = [
  {
    title: "Driver",
    items: [
      "The driver must be at least 21 years old and have held a valid driving licence for at least 2 years.",
      "An ID document (national ID card for residents, passport for visitors) is required at pick-up.",
      "An additional driver can be added for 50 MAD per day. They must meet the same conditions.",
    ],
  },
  {
    title: "Deposit",
    items: [
      "A deposit is required at pick-up, in cash or by bank card. The amount depends on the category: from 3,000 MAD (economy) to 15,000 MAD (luxury).",
      "The deposit is returned when the car comes back in the same condition, with a full tank and on time.",
    ],
  },
  {
    title: "Duration and price",
    items: [
      "The rental is counted in 24-hour periods from the pick-up time. A delay of more than 2 hours counts as an extra day.",
      "Mileage is unlimited. Prices include basic insurance and 24/7 assistance.",
      "A reduced rate applies automatically from 7 days, and again from 30 days of rental.",
    ],
  },
  {
    title: "Fuel",
    items: ["The car is handed over with a full tank and must be returned with a full tank. Otherwise, the missing fuel is charged at the station price plus a 50 MAD service fee."],
  },
  {
    title: "Insurance and damage",
    items: [
      "Basic insurance covers third-party liability. An excess remains payable by the customer in case of damage.",
      "The full insurance option (100 MAD per day) greatly reduces the excess.",
      "Any accident must be reported to the agency immediately, with an accident report filled in.",
    ],
  },
  {
    title: "Cancellation",
    items: [
      "Cancellation is free up to 48 hours before pick-up.",
      "Less than 48 hours before pick-up, one rental day is charged.",
      "If the customer does not show up, one day is charged for the booking.",
    ],
  },
  {
    title: "Use of the vehicle",
    items: [
      "The car may not leave Morocco or be taken on a ferry.",
      "Smoking in the car, subletting it, or using it for racing or paid transport is forbidden.",
      "Off-road driving is allowed for SUVs only, with care.",
    ],
  },
];

export default function ConditionsPage() {
  return (
    <>
      <PageHeader title="Rental terms" text="Everything you need to know before hitting the road." crumbs={[{ label: "Terms" }]} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[240px_1fr] lg:py-20">
        <nav aria-label="Contents" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-line">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#section-${i}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-muted hover:border-ink hover:text-ink">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="max-w-3xl space-y-6">
          {sections.map((s, i) => (
            <FadeUp key={s.title}>
              <section id={`section-${i}`} className="scroll-mt-28 rounded-[20px] border border-line bg-surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold tracking-tight">{s.title}</h2>
                <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
                  {s.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-deep" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </FadeUp>
          ))}
          <p className="text-sm text-muted">
            A question about these terms? Call {BUSINESS.phones[0].label} or write to {BUSINESS.email}.
          </p>
        </div>
      </div>
    </>
  );
}
