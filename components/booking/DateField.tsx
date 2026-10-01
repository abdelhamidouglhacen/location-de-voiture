"use client";

import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

interface Props {
  id: string;
  label: string;
  value?: Date;
  onChange: (day: Date) => void;
  minDate: Date;
  error?: string;
  align?: "left" | "right";
  /** Open the calendar above the field, for forms near the bottom of the screen. */
  up?: boolean;
  /** Show the calendar in the page flow instead of floating, e.g. inside a scrolling panel. */
  inline?: boolean;
  /** Keep the label for screen readers only. */
  hideLabel?: boolean;
}

/** A date input that opens a small calendar. */
export function DateField({ id, label, value, onChange, minDate, error, align = "left", up, inline, hideLabel }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <label htmlFor={id} className={hideLabel ? "sr-only" : "text-xs font-medium text-muted"}>
        {label}
      </label>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          !hideLabel && "mt-1",
          "flex h-11 w-full items-center gap-2 rounded-xl border bg-surface px-3 text-left text-[15px] transition focus:border-ink focus:outline-none",
          error ? "border-red-500" : "border-line hover:border-ink/30",
          !value && "text-muted",
        )}
      >
        <CalendarDays className="size-4 shrink-0 text-accent-deep" aria-hidden />
        <span className="truncate tabular-nums">{value ? formatDate(value) : hideLabel ? label : "Choisir"}</span>
      </button>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={cn(
            "rounded-[20px] border border-line bg-surface p-3",
            inline ? "mt-2 flex justify-center" : cn("absolute z-40 shadow-lift", up ? "bottom-full mb-2" : "top-full mt-2", align === "right" ? "right-0" : "left-0"),
          )}
        >
          <DayPicker
            mode="single"
            locale={fr}
            selected={value}
            defaultMonth={value ?? minDate}
            onSelect={(day) => {
              if (!day) return;
              onChange(day);
              setOpen(false);
            }}
            disabled={{ before: minDate }}
            startMonth={minDate}
          />
        </div>
      )}
    </div>
  );
}
