import { SearchX } from "lucide-react";

export function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-sand text-ink-2">
        <SearchX className="size-5" aria-hidden />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-[15px] text-muted">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
