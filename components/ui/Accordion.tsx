"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface Item {
  question: string;
  answer: string;
}

export function Accordion({ items, className }: { items: Item[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className={cn("divide-y divide-line", className)}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question} data-stagger-item>
            <h3>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={open}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium sm:text-[17px]"
              >
                {item.question}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink">
                  {open ? <Minus className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                </span>
              </button>
            </h3>
            <div
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              className={cn("grid transition-[grid-template-rows] duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <p className="overflow-hidden pr-12 text-[15px] leading-relaxed text-muted">
                <span className="block pb-5">{item.answer}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
