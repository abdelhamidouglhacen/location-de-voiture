import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ size = 44, className, href = "/", subtitle = "Location de voitures" }: { size?: number; className?: string; href?: string; subtitle?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)} aria-label="HG SELF DRIVE, accueil">
      <Image src="/hg-self-drive-logo.png" alt="" width={size} height={size} className="shrink-0 rounded-full" priority />
      <span className="leading-none">
        <span className="block font-display text-[15px] font-semibold tracking-[0.08em] text-ink">HG SELF DRIVE</span>
        <span className="mt-1 block text-[11px] tracking-[0.14em] text-muted uppercase">{subtitle}</span>
      </span>
    </Link>
  );
}
