import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink-2",
  accent: "bg-accent text-ink hover:brightness-105",
  outline: "border border-line bg-surface text-ink hover:border-ink/40",
  ghost: "text-ink hover:bg-sand",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-[15px] gap-2.5",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };
type AsButton = Common & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; loading?: boolean };
type AsLink = Common & { href: string; target?: string; rel?: string; "aria-label"?: string; onClick?: () => void };

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button(props: AsButton | AsLink) {
  const classes = buttonClasses(props.variant, props.size, props.className);

  if (props.href !== undefined) {
    const { href, target, rel, onClick, children } = props;
    const external = /^(https?:|tel:|mailto:)/.test(href);
    return external ? (
      <a href={href} target={target} rel={rel} className={classes} aria-label={props["aria-label"]} onClick={onClick}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes} aria-label={props["aria-label"]} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, loading, children, type = "button", disabled, ...rest } = props;
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />}
      {children}
    </button>
  );
}
