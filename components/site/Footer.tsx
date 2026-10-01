import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { BUSINESS, NAV_LINKS } from "@/lib/constants";
import { Logo } from "./Logo";
import { MapEmbed } from "./MapEmbed";

const socials = [
  { href: BUSINESS.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
  { href: BUSINESS.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: BUSINESS.instagram, label: "Instagram", Icon: InstagramIcon },
];

export function Footer() {
  return (
    <footer className="no-print border-t border-line bg-sand text-ink-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            Car rental in Agadir, from the city centre, Al Massira airport or straight to your hotel.
          </p>
          <ul className="mt-6 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink transition hover:border-ink/30"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">Navigation</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[...NAV_LINKS, { href: "/mes-reservations", label: "My bookings" }, { href: "/conditions", label: "Rental terms" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {BUSINESS.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="inline-flex items-center gap-2.5 tabular-nums transition hover:text-ink">
                  <Phone className="size-4 text-accent-deep" aria-hidden />
                  {p.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${BUSINESS.email}`} className="inline-flex items-center gap-2.5 transition hover:text-ink">
                <Mail className="size-4 text-accent-deep" aria-hidden />
                {BUSINESS.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent-deep" aria-hidden />
              {BUSINESS.address}
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent-deep" aria-hidden />
              Open 24/7, public holidays included
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">Find us</h2>
          <MapEmbed className="mt-4 h-44" />
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} AZUR DRIVE. All rights reserved.</p>
          <p>{BUSINESS.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
