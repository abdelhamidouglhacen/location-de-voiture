"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Animate elements matching this selector instead of the direct children. */
  selector?: string;
  as?: "div" | "ul" | "ol";
}

/** Reveals children one after another (0.1s apart) when the group scrolls into view. */
export function StaggerGroup({ children, className, selector, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLDivElement & HTMLUListElement & HTMLOListElement>(null);
  useGSAP(
    () => {
      const items = selector ? gsap.utils.toArray<HTMLElement>(selector) : Array.from(ref.current?.children ?? []);
      if (!items.length) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(items, { autoAlpha: 0, y: 32 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref, dependencies: [selector] },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
