"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./SectionHeading";

const steps = [
  { title: "Choisissez", text: "Parcourez la flotte et cliquez sur « Réserver » sur la voiture qui vous plaît." },
  { title: "Datez", text: "Le calendrier s'ouvre : choisissez vos jours et heures de départ et de retour." },
  { title: "Envoyez", text: "Remplissez le formulaire. Nous vous rappelons pour confirmer la remise." },
];

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
      const mm = gsap.matchMedia();

      // Desktop: the section stays pinned while the gold line runs from step 1 to step 3.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ref.current, start: "top 72px", end: "+=130%", pin: true, scrub: 0.6, anticipatePin: 1 },
        });
        tl.fromTo("[data-step-line]", { scaleX: 0 }, { scaleX: 1, duration: 3 }, 0);
        steps.forEach((step, i) => {
          const at = i * 1.4;
          tl.fromTo(step, { autoAlpha: 0.3, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, at);
          tl.fromTo(
            step.querySelector("[data-step-number]"),
            { backgroundColor: "#FFFFFF", color: "#121212", borderColor: "#E7E5E2" },
            { backgroundColor: "#121212", color: "#FFFFFF", borderColor: "#121212", duration: 0.3 },
            at,
          );
        });
        tl.to({}, { duration: 0.6 });
      });

      // Mobile: no pinning, steps simply fade in.
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        steps.forEach((step) => {
          gsap.fromTo(step, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, scrollTrigger: { trigger: step, start: "top 82%", once: true } });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="border-y border-line bg-surface py-20 sm:py-28" aria-labelledby="etapes-titre">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading className="mx-auto text-center md:mx-0 md:text-left" id="etapes-titre" title="Réserver en trois gestes" text="Aucun compte à créer. Vous choisissez, vous datez, vous envoyez." />
        <ol data-steps className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          <span data-step-line className="absolute top-5 left-5 hidden h-0.5 origin-left -translate-y-1/2 rounded-full bg-gold md:block" style={{ right: "calc((100% - 5rem) / 3 - 1.25rem)" }} aria-hidden />
          {steps.map((s, i) => (
            <li key={s.title} data-step className="relative text-center md:text-left">
              <span data-step-number className="relative mx-auto grid size-10 md:mx-0 place-items-center rounded-full border border-line bg-surface font-display text-sm font-semibold tabular-nums" aria-hidden>
                {i + 1}
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">
                <span className="sr-only">Étape {i + 1} : </span>
                {s.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs leading-relaxed text-muted md:mx-0">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
