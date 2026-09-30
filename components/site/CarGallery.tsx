"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOverlay } from "@/components/ui/useOverlay";
import { cn } from "@/lib/cn";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

export function CarGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const panelRef = useOverlay(lightbox, () => setLightbox(false));
  const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(mainRef.current, { autoAlpha: 0.2, scale: 1.02 }, { autoAlpha: 1, scale: 1, duration: 0.5 });
      });
    },
    { dependencies: [index], scope: mainRef },
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-sand">
        <div ref={mainRef} className="absolute inset-0">
          <Image src={images[index]} alt={`${name}, photo ${index + 1} sur ${images.length}`} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
        </div>
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2 text-sm font-medium text-ink shadow-card backdrop-blur transition hover:bg-surface"
        >
          <Expand className="size-4" aria-hidden />
          Plein écran
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir la photo ${i + 1}`}
              aria-pressed={i === index}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-paper transition",
                i === index ? "ring-ink" : "opacity-70 ring-transparent hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="160px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox &&
        createPortal(
          <div ref={panelRef} role="dialog" aria-modal="true" aria-label={`Photos de la ${name}`} tabIndex={-1} className="fixed inset-0 z-[70] flex flex-col bg-paper/97 p-4 backdrop-blur">
            <div className="flex items-center justify-between text-ink">
              <p className="text-sm text-muted tabular-nums">
                {index + 1} / {images.length}
              </p>
              <button data-close type="button" onClick={() => setLightbox(false)} className="grid size-11 place-items-center rounded-full border border-line bg-surface hover:bg-sand" aria-label="Fermer">
                <X className="size-6" />
              </button>
            </div>
            <div className="relative flex-1">
              <Image src={images[index]} alt={`${name}, photo ${index + 1}`} fill sizes="100vw" className="object-contain" />
            </div>
            {images.length > 1 && (
              <div className="flex justify-center gap-4 pt-4">
                <button type="button" onClick={() => go(-1)} className="grid size-12 place-items-center rounded-full border border-line bg-surface text-ink hover:border-ink/30" aria-label="Photo précédente">
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={() => go(1)} className="grid size-12 place-items-center rounded-full border border-line bg-surface text-ink hover:border-ink/30" aria-label="Photo suivante">
                  <ChevronRight className="size-6" />
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
