import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "./SectionHeading";

const questions = [
  { question: "What documents do I need to rent a car?", answer: "A driving licence held for at least 2 years, an ID document (national ID card or passport) and the deposit. The driver must be at least 21 years old." },
  { question: "Can you deliver the car to the airport or my hotel?", answer: "Yes. We deliver to Agadir Al Massira airport (150 MAD) and to your hotel in Agadir or Taghazout, at any hour of the day or night." },
  { question: "How does the deposit work?", answer: "The deposit is held at pick-up, in cash or by card, then returned when the vehicle comes back in the same condition. The amount depends on the category." },
  { question: "Is mileage limited?", answer: "No, all our rentals come with unlimited mileage. The car is handed over with a full tank and must be returned with a full tank." },
  { question: "Can I cancel my booking?", answer: "Cancellation is free up to 48 hours before pick-up. After that, one rental day is charged." },
];

export function Faq() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="faq-titre">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading id="faq-titre" title="Frequently asked questions" text="Everything you need to know before hitting the road. Another question? Call us, we answer 24/7." />
        <StaggerGroup selector="[data-stagger-item]">
          <Accordion items={questions} />
        </StaggerGroup>
      </div>
    </section>
  );
}
