"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { useOverlay } from "./useOverlay";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: Props) {
  const panelRef = useOverlay(open, onClose);

  useGSAP(
    () => {
      if (!open) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-backdrop]", { autoAlpha: 0, duration: 0.25 });
        gsap.from(panelRef.current, { autoAlpha: 0, scale: 0.95, y: 8, duration: 0.35 });
      });
    },
    { dependencies: [open] },
  );

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div data-backdrop className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[20px] bg-surface shadow-lift sm:rounded-[20px]",
          widths[size],
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 id="modal-title" className="font-display text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button data-close type="button" onClick={onClose} className="rounded-full p-1.5 text-muted hover:bg-sand" aria-label="Fermer">
            <X className="size-5" />
          </button>
        </header>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-3 border-t border-line px-6 py-4">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
