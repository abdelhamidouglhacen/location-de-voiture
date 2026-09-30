import { TextReveal } from "@/components/animations/TextReveal";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  text?: string;
  id?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({ title, text, id, center, className }: Props) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center", className)}>
      <TextReveal id={id} className="font-display text-3xl leading-[1.1] font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[44px]">
        {title}
      </TextReveal>
      {text && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{text}</p>}
    </div>
  );
}
