"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface Props {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label: string;
}

export function Tabs({ tabs, value, onChange, className, label }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    onChange(tabs[next].value);
    listRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      className={cn("inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-sand p-1", className)}
    >
      {tabs.map((t, i) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition",
              active ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cn("rounded-full px-2 text-xs", active ? "bg-sand" : "bg-line")}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
