"use client";

import { useRef } from "react";

/** Swallows the click that ends a swipe, so dragging a carousel never opens a card link. */
export function SwipeGuard({ children }: { children: React.ReactNode }) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  return (
    <div
      className="contents"
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY };
        dragged.current = false;
      }}
      onPointerMove={(e) => {
        if (start.current && Math.abs(e.clientX - start.current.x) > 8) dragged.current = true;
      }}
      onClickCapture={(e) => {
        if (dragged.current) {
          e.preventDefault();
          e.stopPropagation();
          dragged.current = false;
        }
      }}
    >
      {children}
    </div>
  );
}
