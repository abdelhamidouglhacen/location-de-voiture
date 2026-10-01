import { cn } from "@/lib/cn";

const GOOGLE_MAPS_EMBED = "https://www.google.com/maps?q=Avenue+Hassan+II,+Agadir,+Maroc&z=14&output=embed";

export function MapEmbed({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[20px] border border-line bg-surface", className)}>
      <iframe
        title="Carte Google Maps : agence AZUR DRIVE à Agadir"
        src={GOOGLE_MAPS_EMBED}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="size-full border-0"
      />
    </div>
  );
}
