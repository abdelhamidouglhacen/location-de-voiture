"use client";

import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { GoogleRating } from "./GoogleRating";
import { HeroSearch } from "./HeroSearch";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        const split = SplitText.create(q("[data-hero-title]"), { type: "words", mask: "words" });
        const show = { autoAlpha: 1, y: 0, scale: 1 };
        gsap
          .timeline({ defaults: { duration: 0.7 } })
          .fromTo(q("[data-hero-bg]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9 }, 0)
          .fromTo(q("[data-hero-bg] img"), { scale: 1.08 }, { scale: 1, duration: 1.6, ease: "power2.out" }, 0)
          .fromTo(q("[data-hero-label]"), { autoAlpha: 0, y: 10 }, show, 0.2)
          .set(q("[data-hero-title]"), { autoAlpha: 1 })
          .from(split.words, { yPercent: 110, stagger: 0.08, duration: 0.8 }, "-=0.3")
          .fromTo(q("[data-hero-sub]"), { autoAlpha: 0, y: 16 }, show, "-=0.5")
          .fromTo(q("[data-hero-cta]"), { autoAlpha: 0, y: 16 }, show, "-=0.45")
          .fromTo(q("[data-hero-rating]"), { autoAlpha: 0, y: 16 }, show, "-=0.5")
          .fromTo(q("[data-hero-search]"), { autoAlpha: 0, y: 40 }, { ...show, duration: 0.8 }, 0.35);
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[calc(100dvh-4.5rem)] items-center bg-ink lg:h-[calc(100dvh-4.5rem)] lg:min-h-[600px]"
      aria-labelledby="hero-title"
    >
      <div data-hero-anim data-hero-bg className="absolute inset-0 -z-10 overflow-hidden">
        <Image src="/cars/dacia-duster-1.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[65%_55%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" aria-hidden />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_400px] lg:gap-16 lg:py-8">
        <div className="max-w-xl">
          <p data-hero-anim data-hero-label className="inline-flex items-center gap-3 text-sm font-medium text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden />
            Location de voitures à Agadir
          </p>
          <h1 id="hero-title" data-hero-anim data-hero-title className="mt-6 font-display text-5xl leading-[1.02] font-semibold tracking-[-0.035em] text-white sm:text-6xl xl:text-7xl">
            Best <span className="text-gold">Car</span> For Rent
          </h1>
          <p data-hero-anim data-hero-sub className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
            Conduisez le meilleur, louez avec nous. Voitures récentes, livrées à l&apos;aéroport ou à votre hôtel, jour et nuit.
          </p>
          <div data-hero-anim data-hero-rating className="mt-6 lg:mt-8">
            <GoogleRating />
          </div>
          <div data-hero-anim data-hero-cta className="mt-8 lg:hidden">
            <Button variant="gold" size="lg" onClick={() => setSearchOpen(true)} className="w-full sm:w-auto">
              <CalendarDays className="size-4.5" aria-hidden />
              Réserver
            </Button>
          </div>
        </div>

        <div data-hero-anim data-hero-search id="recherche" className="hidden scroll-mt-24 lg:block">
          <HeroSearch />
        </div>
      </div>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Trouvez votre voiture" description="Choisissez vos lieux, dates et heures.">
        <HeroSearch variant="sheet" />
      </Modal>
    </section>
  );
}
