"use client";

import { ArrowLeft, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { setBookingStatus, setPaymentStatus, useBookingRows } from "@/lib/adminBookings";
import { extras } from "@/lib/data/extras";
import { locations } from "@/lib/data/locations";
import { cn } from "@/lib/cn";
import { formatDate, formatDateTime, formatMAD, formatNumber } from "@/lib/format";
import type { EtatVehicule, StatutReservation } from "@/types";

interface Action {
  label: string;
  variant: "primary" | "outline" | "danger" | "accent";
  title: string;
  text: string;
  toast: string;
  run: (id: string) => void;
}

const status = (to: StatutReservation, a: Omit<Action, "run">): Action => ({ ...a, run: (id) => setBookingStatus(id, to) });

/** Forward steps first, then the step back. */
const ACTIONS: Record<StatutReservation, Action[]> = {
  "Pending": [
    status("Confirmed", {
      label: "Confirm",
      variant: "primary",
      title: "Confirm the booking?",
      text: "Do this after calling the customer and getting their confirmation. The car is reserved for them on these dates; they have not collected it yet.",
      toast: "Booking confirmed.",
    }),
    status("Cancelled", {
      label: "Cancel",
      variant: "danger",
      title: "Cancel the booking?",
      text: "Do this if the customer no longer wants the car or does not answer. The car becomes free again for these dates.",
      toast: "Booking cancelled.",
    }),
  ],
  Confirmed: [
    status("Ongoing", {
      label: "Car handed to customer",
      variant: "primary",
      title: "Has the customer collected the car?",
      text: "Do this when the customer has come to the agency and left with the car. The rental becomes ongoing.",
      toast: "Rental ongoing.",
    }),
    status("Cancelled", {
      label: "Cancel",
      variant: "danger",
      title: "Cancel the booking?",
      text: "Do this if the customer cancels before collecting the car. The car becomes free again for these dates.",
      toast: "Booking cancelled.",
    }),
    status("Pending", {
      label: "Back to “Pending”",
      variant: "outline",
      title: "Go back to “Pending”?",
      text: "Undoes the confirmation: the booking becomes a request to confirm with the customer again.",
      toast: "Booking set back to pending.",
    }),
  ],
  "Ongoing": [
    status("Completed", {
      label: "Complete",
      variant: "primary",
      title: "Complete the rental?",
      text: "Do this when the customer has returned the car to the agency. The rental is closed and the car becomes available again.",
      toast: "Rental completed.",
    }),
    status("Confirmed", {
      label: "Back to “Confirmed”",
      variant: "outline",
      title: "Go back to “Confirmed”?",
      text: "Use this in case of a mistake: the customer has not collected the car yet after all.",
      toast: "Booking set back to “Confirmed”.",
    }),
  ],
  Completed: [
    status("Ongoing", {
      label: "Back to “Ongoing”",
      variant: "outline",
      title: "Go back to “Ongoing”?",
      text: "Use this in case of a mistake: the customer has not returned the car yet.",
      toast: "Rental set back to ongoing.",
    }),
  ],
  Cancelled: [
    status("Pending", {
      label: "Back to “Pending”",
      variant: "outline",
      title: "Restore the booking?",
      text: "Use this if the cancellation was a mistake: the booking becomes a request to confirm with the customer again.",
      toast: "Booking restored.",
    }),
  ],
};

const MARK_PAID: Action = {
  label: "Mark as paid",
  variant: "accent",
  title: "Has the customer paid?",
  text: "Do this when the customer has paid the full rental amount.",
  toast: "Payment recorded.",
  run: (id) => setPaymentStatus(id, "Paid"),
};

const UNMARK_PAID: Action = {
  label: "Undo payment",
  variant: "outline",
  title: "Set the payment back to pending?",
  text: "Use this in case of a mistake: the customer has not paid yet.",
  toast: "Payment set back to pending.",
  run: (id) => setPaymentStatus(id, "Pending"),
};

const lieu = (id: string) => locations.find((l) => l.id === id)?.nom ?? id;

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const b = useBookingRows().find((r) => r.id === id);
  const toast = useToast();
  const [pending, setPending] = useState<Action | null>(null);
  if (!b) return <EmptyState title="Booking not found" text="This booking does not exist." action={<Button href="/admin/reservations">Back to bookings</Button>} />;

  const options = extras.filter((e) => b.options.includes(e.id));

  return (
    <div className="space-y-6">
      <Link href="/admin/reservations" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Bookings
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Created on {formatDateTime(b.creeLe)}</p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-[-0.02em] tabular-nums">{b.reference}</h2>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={b.statut} />
          <StatusBadge status={b.statutPaiement} />
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-muted">Booking</span>
            {ACTIONS[b.statut].map((a) => (
              <Button key={a.label} size="sm" variant={a.variant} onClick={() => setPending(a)}>
                {a.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <span className="mr-1 text-sm text-muted">Payment</span>
            {[b.statutPaiement === "Paid" ? UNMARK_PAID : MARK_PAID].map((a) => (
              <Button key={a.label} size="sm" variant={a.variant} onClick={() => setPending(a)}>
                {a.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Modal
        open={!!pending}
        onClose={() => setPending(null)}
        title={pending?.title ?? ""}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setPending(null)}>
              Back
            </Button>
            <Button
              variant={pending?.variant === "danger" ? "danger" : "primary"}
              onClick={() => {
                if (!pending) return;
                pending.run(b.id);
                toast(pending.toast);
                setPending(null);
              }}
            >
              {pending?.label}
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-muted">{pending?.text}</p>
      </Modal>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Customer">
          <Link href={`/admin/clients/${b.customer.id}`} className="font-medium hover:underline">
            {b.customer.nomComplet}
          </Link>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Phone className="size-4" aria-hidden />
              <a href={`tel:${b.customer.telephone.replace(/\s/g, "")}`} className="tabular-nums hover:text-ink">
                {b.customer.telephone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4" aria-hidden />
              <a href={`mailto:${b.customer.email}`} className="truncate hover:text-ink">
                {b.customer.email}
              </a>
            </li>
          </ul>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
            <Info label="Licence" value={b.customer.numeroPermis} />
            <Info label="Expiry" value={formatDate(b.customer.expirationPermis)} />
            <Info label="ID card / passport" value={b.customer.pieceIdentite} />
            <Info label="Nationality" value={b.customer.nationalite} />
          </dl>
        </Card>

        <Card title="Car">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-sand">
            <Image src={b.car.images[0]} alt="" fill sizes="400px" className="object-cover" />
          </div>
          <Link href={`/admin/voitures/${b.car.id}`} className="mt-3 block font-medium hover:underline">
            {b.car.marque} {b.car.modele}
          </Link>
          <p className="text-sm text-muted">{b.car.immatriculation}</p>
        </Card>

        <Card title="Dates and places">
          <dl className="space-y-4 text-sm">
            <Info label="Pick-up" value={formatDateTime(b.dateDepart)} sub={lieu(b.lieuDepartId)} />
            <Info label="Return" value={formatDateTime(b.dateRetour)} sub={lieu(b.lieuRetourId)} />
            <Info label="Duration" value={`${b.nombreJours} day${b.nombreJours > 1 ? "s" : ""}`} />
            {b.numeroVol && <Info label="Flight" value={b.numeroVol} />}
          </dl>
        </Card>

        <Card title="Price">
          <dl className="space-y-2 text-sm">
            <Row label={`${b.nombreJours} × ${formatMAD(b.car.prixParJour)}`} value={formatMAD(b.sousTotal)} />
            {b.remise > 0 && <Row label="Long-rental discount" value={`− ${formatMAD(b.remise)}`} />}
            {options.map((o) => (
              <Row key={o.id} label={o.nom} value={formatMAD(o.unite === "jour" ? o.prix * b.nombreJours : o.prix)} />
            ))}
            <div className="flex justify-between border-t border-line pt-3 font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatMAD(b.total)}</dd>
            </div>
            <Row label="Deposit" value={formatMAD(b.car.caution)} />
          </dl>
        </Card>

        <Card title="History">
          <ol className="relative space-y-4 border-l border-line pl-5">
            {b.historique.map((h, i) => (
              <li key={i} className="relative">
                <span className={cn("absolute top-1.5 -left-[25px] size-2.5 rounded-full ring-4 ring-surface", i === b.historique.length - 1 ? "bg-accent-deep" : "bg-line")} aria-hidden />
                <p className="text-sm font-medium">{h.statut}</p>
                <p className="text-xs text-muted tabular-nums">{formatDateTime(h.date)}</p>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Vehicle condition">
          {b.etatDepart || b.etatRetour ? (
            <div className="space-y-3">
              {b.etatDepart && <VehicleState label="At pick-up" etat={b.etatDepart} />}
              {b.etatRetour && <VehicleState label="At return" etat={b.etatRetour} />}
            </div>
          ) : (
            <p className="text-sm text-muted">Not picked up yet.</p>
          )}
        </Card>

        {b.notes && (
          <Card title="Notes" className="lg:col-span-3">
            <p className="text-sm text-ink-2">{b.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function Info({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
      {sub && <dd className="text-muted">{sub}</dd>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

function VehicleState({ label, etat }: { label: string; etat: EtatVehicule }) {
  return (
    <dl className="grid grid-cols-3 gap-3 rounded-xl bg-paper p-3 text-sm">
      <p className="col-span-3 text-xs font-medium text-muted">{label}</p>
      <Info label="Km" value={formatNumber(etat.kilometrage)} />
      <Info label="Fuel" value={etat.carburant} />
      <Info label="Damage" value={etat.dommages} />
    </dl>
  );
}
