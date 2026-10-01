"use client";

import { CalendarDays, Info, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { ReserveDialog } from "@/components/booking/ReserveDialog";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/States";
import { Tabs } from "@/components/ui/Tabs";
import { whatsappLink } from "@/lib/constants";
import { cars } from "@/lib/data/cars";
import { formatDate, formatDateTime, formatMAD } from "@/lib/format";
import { removeBooking, useMyBookings, type SavedBooking } from "@/lib/myBookings";

type Phase = { label: string; tone: BadgeTone; upcoming: boolean };

function phaseOf(b: SavedBooking, now: number): Phase {
  if (new Date(b.retour).getTime() < now) return { label: "Completed", tone: "gray", upcoming: false };
  if (new Date(b.depart).getTime() <= now) return { label: "Ongoing", tone: "green", upcoming: true };
  return { label: "Upcoming", tone: "blue", upcoming: true };
}

export function MyReservations() {
  const bookings = useMyBookings();
  const [tab, setTab] = useState("a-venir");
  const [toRemove, setToRemove] = useState<SavedBooking | null>(null);
  const [now] = useState(() => Date.now());

  if (bookings === null) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (bookings.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <EmptyState
          title="No bookings yet"
          text="Requests sent from this browser will appear here, with their dates, pick-up place and estimated price."
          action={<Button href="/voitures">Choose a car</Button>}
        />
      </div>
    );
  }

  const upcoming = bookings.filter((b) => phaseOf(b, now).upcoming);
  const past = bookings.filter((b) => !phaseOf(b, now).upcoming);
  const list = tab === "a-venir" ? upcoming : past;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs
          label="Filter my bookings"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "a-venir", label: "Upcoming", count: upcoming.length },
            { value: "passees", label: "Past", count: past.length },
          ]}
        />
        <p className="flex items-center gap-2 text-sm text-muted">
          <Info className="size-4" aria-hidden />
          Saved on this device only
        </p>
      </div>

      {list.length === 0 ? (
        <div className="mt-8 rounded-[20px] border border-line bg-surface">
          <EmptyState
            title={tab === "a-venir" ? "Nothing planned" : "No past rentals yet"}
            text={tab === "a-venir" ? "You have no upcoming rentals." : "Your past rentals will appear here."}
            action={<Button href="/voitures">See our cars</Button>}
          />
        </div>
      ) : (
        <StaggerGroup key={tab} className="mt-8 space-y-5">
          {list.map((b) => (
            <BookingCard key={b.reference} booking={b} phase={phaseOf(b, now)} onRemove={() => setToRemove(b)} />
          ))}
        </StaggerGroup>
      )}

      <Modal
        open={!!toRemove}
        onClose={() => setToRemove(null)}
        title="Remove from history?"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setToRemove(null)}>
              Keep
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                removeBooking(toRemove!.reference);
                setToRemove(null);
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p className="text-[15px] leading-relaxed text-muted">
          Request {toRemove?.reference} will disappear from this list. This does not cancel the booking with the agency: to cancel, call us or
          message us on WhatsApp.
        </p>
      </Modal>
    </div>
  );
}

function BookingCard({ booking: b, phase, onRemove }: { booking: SavedBooking; phase: Phase; onRemove: () => void }) {
  const car = cars.find((c) => c.id === b.carId);
  return (
    <article className="grid overflow-hidden rounded-[20px] border border-line bg-surface md:grid-cols-[260px_1fr]">
      <div className="relative aspect-[16/10] bg-sand md:aspect-auto">
        <Image src={b.image} alt="" fill sizes="(min-width: 768px) 260px, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">{b.carName}</h2>
            <p className="mt-0.5 text-sm text-muted tabular-nums">
              Request {b.reference}, sent on {formatDate(b.envoyeLe)}
            </p>
          </div>
          <Badge tone={phase.tone}>{phase.label}</Badge>
        </div>

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="flex gap-3">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-accent-deep" aria-hidden />
            <div>
              <dt className="text-muted">Dates ({b.jours} day{b.jours > 1 ? "s" : ""})</dt>
              <dd className="font-medium tabular-nums">
                {formatDateTime(b.depart)} → {formatDateTime(b.retour)}
              </dd>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-accent-deep" aria-hidden />
            <div>
              <dt className="text-muted">Pick-up / return</dt>
              <dd className="font-medium">
                {b.lieuDepart}
                {b.lieuRetour !== b.lieuDepart && ` → ${b.lieuRetour}`}
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-muted">Extras</dt>
            <dd className="font-medium">{b.options.join(", ") || "None"}</dd>
          </div>
          <div>
            <dt className="text-muted">Driver</dt>
            <dd className="font-medium">
              {b.conducteur}, <span className="tabular-nums">{b.telephone}</span>
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
          <p className="leading-tight">
            <span className="block text-sm text-muted">Estimated total</span>
            <span className="font-display text-2xl font-semibold tabular-nums">{formatMAD(b.total)}</span>
            <span className="ml-2 text-xs text-muted tabular-nums">+ deposit {formatMAD(b.caution)}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {phase.upcoming ? (
              <Button href={whatsappLink(b.message)} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
                <WhatsAppIcon className="size-4 text-[#1FA855]" />
                Resend
              </Button>
            ) : (
              car && car.statut !== "In maintenance" && <ReserveDialog car={{ id: car.id, name: b.carName, prixParJour: car.prixParJour }} label="Rent again" />
            )}
            {car && (
              <Button href={`/voitures/${car.id}`} variant="outline" size="sm">
                View car
              </Button>
            )}
            <button
              type="button"
              onClick={onRemove}
              className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-700"
              aria-label={`Remove request ${b.reference} from history`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

