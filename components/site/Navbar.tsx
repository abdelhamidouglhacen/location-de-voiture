"use client";

import { CalendarCheck, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { BUSINESS, NAV_LINKS } from "@/lib/constants";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Logo } from "./Logo";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const trigger = ScrollTrigger.create({ start: 24, onToggle: (self) => setScrolled(self.isActive) });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      if (!menuOpen) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo("[data-menu-link]", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.5 });
      });
    },
    { scope: menuRef, dependencies: [menuOpen] },
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled ? "border-line bg-paper/85 shadow-[0_8px_24px_-18px_rgb(18_18_18/0.25)] backdrop-blur-lg" : "border-transparent bg-paper",
        )}
      >
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6" aria-label="Navigation principale">
          <Logo />
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-[15px] transition",
                    isActive(l.href) ? "bg-sand font-medium text-ink" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden items-center gap-3 lg:flex">
            <a href={BUSINESS.phones[0].href} className="mr-2 hidden items-center gap-2 text-[15px] font-medium text-ink tabular-nums xl:inline-flex">
              <Phone className="size-4 text-gold-deep" aria-hidden />
              {BUSINESS.phones[0].label}
            </a>
            <Link
              href="/mes-reservations"
              aria-current={isActive("/mes-reservations") ? "page" : undefined}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition",
                isActive("/mes-reservations") ? "border-ink bg-surface text-ink" : "border-line bg-surface text-ink hover:border-ink/40",
              )}
            >
              <CalendarCheck className="size-4 text-gold-deep" aria-hidden />
              Mes réservations
            </Link>
            {/* <Button href="/voitures">Réserver</Button> */}
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line text-ink lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
          >
            <Menu className="size-5" />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div ref={menuRef} id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col bg-paper px-5 pt-4 pb-8 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <button type="button" onClick={() => setMenuOpen(false)} className="grid size-11 place-items-center rounded-full border border-line" aria-label="Fermer le menu" autoFocus>
              <X className="size-5" />
            </button>
          </div>
          <ul className="mt-12 flex flex-col">
            {[...NAV_LINKS, { href: "/mes-reservations", label: "Mes réservations" }].map((l) => (
              <li key={l.href} data-menu-link className="border-b border-line">
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn("block py-4 font-display text-3xl font-medium tracking-tight", isActive(l.href) ? "text-gold-deep" : "text-ink")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3" data-menu-link>
            <Button href="/voitures" size="lg" onClick={() => setMenuOpen(false)}>
              Réserver une voiture
            </Button>
            <Button href={BUSINESS.phones[0].href} variant="outline" size="lg">
              <Phone className="size-4" aria-hidden />
              {BUSINESS.phones[0].label}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
