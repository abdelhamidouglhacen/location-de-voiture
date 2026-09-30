"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Fades the block in and moves it up 40px the first time it enters the screen. */
export function FadeUp({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(ref.current, { autoAlpha: 0, y: 40 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
