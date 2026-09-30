import { cn } from "@/lib/cn";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: React.ReactNode;
  padded?: boolean;
}

export function Card({ title, action, padded = true, className, children, ...rest }: Props) {
  return (
    <div className={cn("rounded-[20px] border border-line bg-surface", className)} {...rest}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          {title && <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>}
          {action}
        </div>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </div>
  );
}
