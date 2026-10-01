import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ContactForm } from "@/components/site/ContactForm";
import { MapEmbed } from "@/components/site/MapEmbed";
import { PageHeader } from "@/components/site/PageHeader";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AZUR DRIVE in Agadir by phone, WhatsApp or email, 24/7.",
};

const cards = [
  { Icon: Phone, title: "Phone", lines: BUSINESS.phones.map((p) => ({ label: p.label, href: p.href })) },
  { Icon: WhatsAppIcon, title: "WhatsApp", lines: [{ label: "Message us on WhatsApp", href: BUSINESS.whatsapp }] },
  { Icon: Mail, title: "Email", lines: [{ label: BUSINESS.email, href: `mailto:${BUSINESS.email}` }] },
  { Icon: Clock, title: "Opening hours", lines: [{ label: "24/7, public holidays included" }] },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact" text="A question, an urgent booking? We answer day and night." crumbs={[{ label: "Contact" }]} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
        <section aria-labelledby="form-titre">
          <h2 id="form-titre" className="font-display text-2xl font-semibold tracking-tight">
            Write to us
          </h2>
          <p className="mt-2 mb-8 text-muted">Reply in under an hour, in English, French or Arabic.</p>
          <ContactForm />
        </section>
        <aside className="space-y-4" aria-label="Contact details">
          <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {cards.map(({ Icon, title, lines }) => (
              <div key={title} className="flex gap-4 rounded-[20px] border border-line bg-surface p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-deep">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  {lines.map((l) =>
                    "href" in l && l.href ? (
                      <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block text-muted hover:text-ink">
                        {l.label}
                      </a>
                    ) : (
                      <p key={l.label} className="text-muted">
                        {l.label}
                      </p>
                    ),
                  )}
                </div>
              </div>
            ))}
          </StaggerGroup>
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-medium">
              <MapPin className="size-4 text-accent-deep" aria-hidden />
              {BUSINESS.address}
            </p>
            <MapEmbed className="h-72" />
          </div>
        </aside>
      </div>
    </>
  );
}
