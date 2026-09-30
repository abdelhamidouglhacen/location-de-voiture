"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

interface Props {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  id?: string;
}

/** Splits a headline into words that slide up from a mask when it scrolls into view. */
export function TextReveal({ children, as: Tag = "h2", className, id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        SplitText.create(ref.current, {
          type: "words",
          mask: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(self.words, { yPercent: 110 }, {
              yPercent: 0,
              duration: 0.8,
              stagger: 0.06,
              scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
            }),
        });
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
