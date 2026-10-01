import { ArrowUpRight, Star, StarHalf } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { BUSINESS } from "@/lib/constants";

/** Google Maps rating badge for dark backgrounds, linking to the listing. */
export function GoogleRating() {
  const rating = BUSINESS.googleRating;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <a
      href={BUSINESS.googleMaps}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Rated ${rating} out of 5 on Google Maps. See reviews`}
      className="group inline-flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 py-3 pr-5 pl-3 backdrop-blur-md transition hover:border-white/30 hover:bg-white/15"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white">
        <GoogleIcon className="size-5.5" />
      </span>
      <span className="font-display text-3xl leading-none font-semibold text-white tabular-nums">{rating}</span>
      <span className="flex flex-col gap-1">
        <span className="flex gap-0.5 text-amber-400" aria-hidden>
          {Array.from({ length: 5 }, (_, i) =>
            i < full ? (
              <Star key={i} className="size-4 fill-current" />
            ) : i === full && half ? (
              <span key={i} className="relative size-4">
                <Star className="absolute inset-0 size-4 text-white/30" />
                <StarHalf className="absolute inset-0 size-4 fill-current" />
              </span>
            ) : (
              <Star key={i} className="size-4 text-white/30" />
            ),
          )}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-white/70 group-hover:text-white">
          Google Maps reviews
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </span>
    </a>
  );
}
