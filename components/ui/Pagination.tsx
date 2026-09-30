import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  total: number;
  pageSize: number;
}

export function Pagination({ page, pageCount, onChange, total, pageSize }: Props) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const btn = "grid size-9 place-items-center rounded-full text-sm transition disabled:opacity-40";

  return (
    <nav className="flex flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row" aria-label="Pagination">
      <p className="text-sm text-muted">
        {from} à {to} sur {total}
      </p>
      <div className="flex items-center gap-1">
        <button type="button" className={cn(btn, "hover:bg-sand")} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Page précédente">
          <ChevronLeft className="size-4" />
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(btn, p === page ? "bg-ink font-semibold text-white" : "hover:bg-sand")}
          >
            {p}
          </button>
        ))}
        <button type="button" className={cn(btn, "hover:bg-sand")} onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Page suivante">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
