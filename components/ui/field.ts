export const fieldBase =
  "w-full rounded-xl border bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5 disabled:bg-sand disabled:text-muted";

export function fieldBorder(error?: string) {
  return error ? "border-red-500" : "border-line";
}
