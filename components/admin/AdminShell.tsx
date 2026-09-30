"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useOverlay } from "@/components/ui/useOverlay";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const noop = () => () => {};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The sample data is dated relative to today, so admin pages render in the browser only.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useOverlay(menuOpen, () => setMenuOpen(false));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile menu after navigation
    setMenuOpen(false);
  }, [pathname]);

  useGSAP(
    () => {
      if (!menuOpen) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(panelRef.current, { xPercent: -100 }, { xPercent: 0, duration: 0.4 });
      });
    },
    { dependencies: [menuOpen], scope: wrapRef },
  );

  return (
    <div className="flex min-h-dvh bg-paper text-ink">
      <div className="sticky top-0 hidden h-dvh lg:block">
        <Sidebar />
      </div>

      {menuOpen && (
        <div ref={wrapRef} className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setMenuOpen(false)} aria-hidden />
          <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1} className="relative h-full w-fit">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
            <button
              data-close
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 -right-12 grid size-10 place-items-center rounded-full border border-line bg-surface"
              aria-label="Fermer le menu"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main id="contenu" className="mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-8">
          {mounted && children}
        </main>
      </div>
    </div>
  );
}
