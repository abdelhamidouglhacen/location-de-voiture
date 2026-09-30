"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/cn";
import { ADMIN_NAV, isActive } from "./nav";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-[248px] flex-col border-r border-line bg-surface" aria-label="Menu d'administration">
      <div className="flex h-18 shrink-0 items-center px-5">
        <Logo href="/admin" size={36} subtitle="Administration" />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {ADMIN_NAV.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition",
                    active ? "bg-sand font-medium text-ink" : "text-muted hover:bg-paper hover:text-ink",
                  )}
                >
                  <Icon className={cn("size-4.5 shrink-0", active && "text-gold-deep")} strokeWidth={1.75} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-line p-3">
        <Link href="/" className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm text-muted transition hover:bg-paper hover:text-ink">
          <ArrowUpRight className="size-4.5" strokeWidth={1.75} aria-hidden />
          Voir le site
        </Link>
      </div>
    </aside>
  );
}
