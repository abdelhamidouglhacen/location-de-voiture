"use client";

import { useSyncExternalStore } from "react";

/**
 * Booking requests sent from this browser, kept in localStorage.
 * There is no account or server: the list only exists on this device.
 */
export interface SavedBooking {
  reference: string;
  carId: string;
  carName: string;
  image: string;
  depart: string;
  retour: string;
  lieuDepart: string;
  lieuRetour: string;
  options: string[];
  jours: number;
  total: number;
  caution: number;
  conducteur: string;
  telephone: string;
  envoyeLe: string;
  message: string;
}

const KEY = "azur-my-bookings";
const EVENT = "azur-my-bookings-change";
const EMPTY: SavedBooking[] = [];

let cache: { raw: string | null; list: SavedBooking[] } = { raw: null, list: EMPTY };

function read(): SavedBooking[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.list;
  let list = EMPTY;
  try {
    list = raw ? (JSON.parse(raw) as SavedBooking[]) : EMPTY;
  } catch {
    list = EMPTY;
  }
  cache = { raw, list };
  return list;
}

function write(list: SavedBooking[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage blocked or full: the booking was still sent through WhatsApp.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function saveBooking(booking: SavedBooking) {
  write([booking, ...read().filter((b) => b.reference !== booking.reference)]);
}

export function removeBooking(reference: string) {
  write(read().filter((b) => b.reference !== reference));
}

/** Returns null during server rendering, then the saved list. */
export function useMyBookings(): SavedBooking[] | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
