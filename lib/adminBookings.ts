"use client";

import { useMemo, useSyncExternalStore } from "react";
import { type BookingRow, bookingRows } from "@/lib/data/admin";
import type { BookingEvent, StatutPaiement, StatutReservation } from "@/types";

/** Admin status changes, kept in memory only: a page refresh restores the sample data. */
type Override = { statut?: StatutReservation; statutPaiement?: StatutPaiement; events?: BookingEvent[] };
type Overrides = Record<string, Override>;

const EMPTY: Overrides = {};
let overrides: Overrides = EMPTY;
const listeners = new Set<() => void>();

function update(id: string, patch: (o: Override) => Override) {
  overrides = { ...overrides, [id]: patch(overrides[id] ?? {}) };
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function setBookingStatus(id: string, statut: StatutReservation) {
  update(id, (o) => ({ ...o, statut, events: [...(o.events ?? []), { statut, date: new Date().toISOString() }] }));
}

export function setPaymentStatus(id: string, statutPaiement: StatutPaiement) {
  update(id, (o) => ({ ...o, statutPaiement }));
}

export function useBookingRows(): BookingRow[] {
  const current = useSyncExternalStore(subscribe, () => overrides, () => EMPTY);
  return useMemo(
    () =>
      bookingRows.map((b) => {
        const o = current[b.id];
        if (!o) return b;
        return {
          ...b,
          statut: o.statut ?? b.statut,
          statutPaiement: o.statutPaiement ?? b.statutPaiement,
          historique: [...b.historique, ...(o.events ?? [])],
        };
      }),
    [current],
  );
}
