import { cn } from "@/lib/cn";

const tones = {
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  blue: "bg-blue-50 text-blue-800 ring-blue-200",
  green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  gray: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  red: "bg-red-50 text-red-800 ring-red-200",
  orange: "bg-orange-50 text-orange-800 ring-orange-200",
  purple: "bg-purple-50 text-purple-800 ring-purple-200",
  gold: "bg-surface/90 text-ink ring-line backdrop-blur",
} as const;

export type BadgeTone = keyof typeof tones;

const STATUS_TONES: Record<string, BadgeTone> = {
  "En attente": "amber",
  Confirmée: "blue",
  "En cours": "green",
  Terminée: "gray",
  Annulée: "red",
  "En maintenance": "orange",
  Payé: "green",
  Remboursé: "purple",
  Disponible: "green",
  Louée: "blue",
};

export function statusTone(status: string): BadgeTone {
  return STATUS_TONES[status] ?? "gray";
}

export function Badge({ tone = "gray", children, className }: { tone?: BadgeTone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset", tones[tone], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone(status)}>{status}</Badge>;
}
