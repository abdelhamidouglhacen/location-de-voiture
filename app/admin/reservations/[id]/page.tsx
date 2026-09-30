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
  variant: "primary" | "outline" | "danger" | "gold";
  title: string;
  text: string;
  toast: string;
  run: (id: string) => void;
}

const status = (to: StatutReservation, a: Omit<Action, "run">): Action => ({ ...a, run: (id) => setBookingStatus(id, to) });

/** Forward steps first, then the step back. */
const ACTIONS: Record<StatutReservation, Action[]> = {
  "En attente": [
    status("Confirmée", {
      label: "Confirmer",
      variant: "primary",
      title: "Confirmer la réservation ?",
      text: "À faire après avoir appelé le client et qu'il a confirmé sa location. La voiture lui est réservée pour ces dates ; il ne l'a pas encore récupérée.",
      toast: "Réservation confirmée.",
    }),
    status("Annulée", {
      label: "Annuler",
      variant: "danger",
      title: "Annuler la réservation ?",
      text: "À faire si le client ne souhaite plus louer la voiture ou ne répond pas. La voiture redevient libre pour ces dates.",
      toast: "Réservation annulée.",
    }),
  ],
  Confirmée: [
    status("En cours", {
      label: "Voiture remise au client",
      variant: "primary",
      title: "Le client a récupéré la voiture ?",
      text: "À faire quand le client est venu à l'agence et est reparti avec la voiture. La location passe en cours.",
      toast: "Location en cours.",
    }),
    status("Annulée", {
      label: "Annuler",
      variant: "danger",
      title: "Annuler la réservation ?",
      text: "À faire si le client annule avant de récupérer la voiture. La voiture redevient libre pour ces dates.",
      toast: "Réservation annulée.",
    }),
    status("En attente", {
      label: "Revenir à « En attente »",
      variant: "outline",
      title: "Revenir à « En attente » ?",
      text: "Annule la confirmation : la réservation redevient une demande à confirmer avec le client.",
      toast: "Réservation remise en attente.",
    }),
  ],
  "En cours": [
    status("Terminée", {
      label: "Terminer",
      variant: "primary",
      title: "Terminer la location ?",
      text: "À faire quand le client a rendu la voiture à l'agence. La location est clôturée et la voiture redevient disponible.",
      toast: "Location terminée.",
    }),
    status("Confirmée", {
      label: "Revenir à « Confirmée »",
      variant: "outline",
      title: "Revenir à « Confirmée » ?",
      text: "À utiliser en cas d'erreur : le client n'a finalement pas encore récupéré la voiture.",
      toast: "Réservation remise à « Confirmée ».",
    }),
  ],
  Terminée: [
    status("En cours", {
      label: "Revenir à « En cours »",
      variant: "outline",
      title: "Revenir à « En cours » ?",
      text: "À utiliser en cas d'erreur : le client n'a pas encore rendu la voiture.",
      toast: "Location remise en cours.",
    }),
  ],
  Annulée: [
    status("En attente", {
      label: "Revenir à « En attente »",
      variant: "outline",
      title: "Rétablir la réservation ?",
      text: "À utiliser si l'annulation était une erreur : la réservation redevient une demande à confirmer avec le client.",
      toast: "Réservation rétablie.",
    }),
  ],
};

const MARK_PAID: Action = {
  label: "Marquer payé",
  variant: "gold",
  title: "Le client a payé ?",
  text: "À faire quand le client a réglé le montant total de la location.",
  toast: "Paiement enregistré.",
  run: (id) => setPaymentStatus(id, "Payé"),
};

const UNMARK_PAID: Action = {
  label: "Annuler le paiement",
  variant: "outline",
  title: "Remettre le paiement en attente ?",
  text: "À utiliser en cas d'erreur : le client n'a pas encore payé.",
  toast: "Paiement remis en attente.",
  run: (id) => setPaymentStatus(id, "En attente"),
};

const lieu = (id: string) => locations.find((l) => l.id === id)?.nom ?? id;

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const b = useBookingRows().find((r) => r.id === id);
  const toast = useToast();
  const [pending, setPending] = useState<Action | null>(null);
  if (!b) return <EmptyState title="Réservation introuvable" text="Cette réservation n'existe pas." action={<Button href="/admin/reservations">Retour aux réservations</Button>} />;

  const options = extras.filter((e) => b.options.includes(e.id));

  return (
    <div className="space-y-6">
      <Link href="/admin/reservations" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Réservations
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Créée le {formatDateTime(b.creeLe)}</p>
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
            <span className="mr-1 text-sm text-muted">Réservation</span>
            {ACTIONS[b.statut].map((a) => (
              <Button key={a.label} size="sm" variant={a.variant} onClick={() => setPending(a)}>
                {a.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <span className="mr-1 text-sm text-muted">Paiement</span>
            {[b.statutPaiement === "Payé" ? UNMARK_PAID : MARK_PAID].map((a) => (
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
              Retour
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
        <Card title="Client">
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
            <Info label="Permis" value={b.customer.numeroPermis} />
            <Info label="Expiration" value={formatDate(b.customer.expirationPermis)} />
            <Info label="CIN / passeport" value={b.customer.pieceIdentite} />
            <Info label="Nationalité" value={b.customer.nationalite} />
          </dl>
        </Card>

        <Card title="Voiture">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-sand">
            <Image src={b.car.images[0]} alt="" fill sizes="400px" className="object-cover" />
          </div>
          <Link href={`/admin/voitures/${b.car.id}`} className="mt-3 block font-medium hover:underline">
            {b.car.marque} {b.car.modele}
          </Link>
          <p className="text-sm text-muted">{b.car.immatriculation}</p>
        </Card>

        <Card title="Dates et lieux">
          <dl className="space-y-4 text-sm">
            <Info label="Départ" value={formatDateTime(b.dateDepart)} sub={lieu(b.lieuDepartId)} />
            <Info label="Retour" value={formatDateTime(b.dateRetour)} sub={lieu(b.lieuRetourId)} />
            <Info label="Durée" value={`${b.nombreJours} jour${b.nombreJours > 1 ? "s" : ""}`} />
            {b.numeroVol && <Info label="Vol" value={b.numeroVol} />}
          </dl>
        </Card>

        <Card title="Prix">
          <dl className="space-y-2 text-sm">
            <Row label={`${b.nombreJours} × ${formatMAD(b.car.prixParJour)}`} value={formatMAD(b.sousTotal)} />
            {b.remise > 0 && <Row label="Remise longue durée" value={`− ${formatMAD(b.remise)}`} />}
            {options.map((o) => (
              <Row key={o.id} label={o.nom} value={formatMAD(o.unite === "jour" ? o.prix * b.nombreJours : o.prix)} />
            ))}
            <div className="flex justify-between border-t border-line pt-3 font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatMAD(b.total)}</dd>
            </div>
            <Row label="Caution" value={formatMAD(b.car.caution)} />
          </dl>
        </Card>

        <Card title="Historique">
          <ol className="relative space-y-4 border-l border-line pl-5">
            {b.historique.map((h, i) => (
              <li key={i} className="relative">
                <span className={cn("absolute top-1.5 -left-[25px] size-2.5 rounded-full ring-4 ring-surface", i === b.historique.length - 1 ? "bg-gold-deep" : "bg-line")} aria-hidden />
                <p className="text-sm font-medium">{h.statut}</p>
                <p className="text-xs text-muted tabular-nums">{formatDateTime(h.date)}</p>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="État du véhicule">
          {b.etatDepart || b.etatRetour ? (
            <div className="space-y-3">
              {b.etatDepart && <VehicleState label="Au départ" etat={b.etatDepart} />}
              {b.etatRetour && <VehicleState label="Au retour" etat={b.etatRetour} />}
            </div>
          ) : (
            <p className="text-sm text-muted">Pas encore de départ.</p>
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
      <Info label="Carburant" value={etat.carburant} />
      <Info label="Dommages" value={etat.dommages} />
    </dl>
  );
}
