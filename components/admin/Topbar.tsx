"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { formatLongDate } from "@/lib/format";
import { titleFor } from "./nav";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-18 shrink-0 items-center gap-3 border-b border-line bg-paper/85 px-4 backdrop-blur-lg sm:px-8">
      <button type="button" onClick={onOpenMenu} className="grid size-10 place-items-center rounded-full border border-line bg-surface lg:hidden" aria-label="Open menu">
        <Menu className="size-4.5" />
      </button>
      <h1 className="truncate font-display text-lg font-semibold tracking-tight">{titleFor(pathname)}</h1>
      <p className="ml-auto hidden text-sm text-muted capitalize sm:block" suppressHydrationWarning>
        {formatLongDate(new Date())}
      </p>
    </header>
  );
}
