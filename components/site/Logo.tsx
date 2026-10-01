import Link from "next/link";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/constants";

/** Brand mark: an "A" whose legs are a road, with the centre line in the accent blue. */
export function LogoMark({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={cn("shrink-0", className)} fill="none" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="20" cy="20" r="20" className="fill-ink" />
      <path d="M11.5 28 20 11l8.5 17" className="stroke-white" />
      <path d="M20 21.5V28" className="stroke-accent" />
    </svg>
  );
}

export function Logo({ size = 44, className, href = "/", subtitle = "Location de voitures" }: { size?: number; className?: string; href?: string; subtitle?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)} aria-label={`${BUSINESS.name}, accueil`}>
      <LogoMark size={size} />
      <span className="leading-none">
        <span className="block font-display text-[15px] font-semibold tracking-[0.08em] text-ink">{BUSINESS.name}</span>
        <span className="mt-1 block text-[11px] tracking-[0.14em] text-muted uppercase">{subtitle}</span>
      </span>
    </Link>
  );
}
