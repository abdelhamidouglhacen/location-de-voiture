import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { TextReveal } from "@/components/animations/TextReveal";

interface Props {
  title: string;
  text?: string;
  crumbs: { href?: string; label: string }[];
  children?: React.ReactNode;
}

export function PageHeader({ title, text, crumbs, children }: Props) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            {[{ href: "/", label: "Home" }, ...crumbs].map((c, i, all) => (
              <li key={c.label} className="inline-flex items-center gap-1.5">
                {c.href && i < all.length - 1 ? (
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink">
                    {c.label}
                  </span>
                )}
                {i < all.length - 1 && <ChevronRight className="size-3.5" aria-hidden />}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <TextReveal as="h1" className="font-display text-4xl font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              {title}
            </TextReveal>
            {text && <p className="mt-4 max-w-2xl text-lg text-muted">{text}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
