import { cn } from "@/lib/cn";

const GOOGLE_MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3441.3549976707523!2d-9.533811325163498!3d30.397668374747642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3c99f13337bd3%3A0x5e77dc82507f4aa!2sHG%20SELF%20DRIVE!5e0!3m2!1sfr!2sma!4v1790700491280!5m2!1sfr!2sma";

export function MapEmbed({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[20px] border border-line bg-surface", className)}>
      <iframe
        title="Carte Google Maps : agence HG SELF DRIVE à Agadir"
        src={GOOGLE_MAPS_EMBED}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="size-full border-0"
      />
    </div>
  );
}
