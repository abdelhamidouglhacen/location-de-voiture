"use client";

import { useRef } from "react";
import { formatMAD, formatNumber } from "@/lib/format";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const formats = {
  mad: formatMAD,
  number: formatNumber,
  percent: (n: number) => `${n.toFixed(1).replace(".", ",")} %`,
};

interface Props {
  value: number;
  format?: keyof typeof formats;
  className?: string;
  duration?: number;
}

/** Counts from 0 (or the previous value) to `value`. Text is updated directly, no re-render per frame. */
export function CountUp({ value, format = "number", className, duration = 1.2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef({ n: 0 });
  const fmt = formats[format];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to(current.current, {
          n: value,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = fmt(current.current.n);
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        current.current.n = value;
        el.textContent = fmt(value);
      });
    },
    { dependencies: [value], scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}
