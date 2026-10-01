import { Baby, Map, Plane, ShieldCheck, UserPlus } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatMAD } from "@/lib/format";
import type { Extra } from "@/types";

const icons: Record<string, typeof Map> = {
  gps: Map,
  "siege-bebe": Baby,
  conducteur: UserPlus,
  assurance: ShieldCheck,
  "livraison-aeroport": Plane,
};

interface Props {
  extras: Extra[];
  selected: string[];
  days: number;
  onToggle: (id: string) => void;
}

export function ExtrasList({ extras, selected, days, onToggle }: Props) {
  return (
    <fieldset>
      <legend className="sr-only">Options</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {extras.map((extra) => {
          const Icon = icons[extra.id] ?? ShieldCheck;
          const checked = selected.includes(extra.id);
          const total = extra.unite === "jour" ? extra.prix * days : extra.prix;
          return (
            <label
              key={extra.id}
              className={cn(
                "relative flex cursor-pointer gap-4 rounded-2xl border bg-surface p-5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-deep",
                checked ? "border-ink ring-1 ring-ink" : "border-line hover:border-ink/30",
              )}
            >
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => onToggle(extra.id)} />
              <span className={cn("grid size-11 shrink-0 place-items-center rounded-full transition", checked ? "bg-ink text-white" : "bg-sand text-ink")}>
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="font-medium">{extra.nom}</span>
                  <span className={cn("grid size-5 shrink-0 place-items-center rounded border-2", checked ? "border-ink bg-ink" : "border-line")} aria-hidden>
                    {checked && <span className="size-2 rounded-sm bg-white" />}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-muted">{extra.description}</span>
                <span className="mt-3 block text-sm">
                  <strong>{formatMAD(extra.prix)}</strong>
                  <span className="text-muted">{extra.unite === "jour" ? " / jour" : " forfait"}</span>
                  {extra.unite === "jour" && <span className="text-muted"> · {formatMAD(total)} au total</span>}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
