"use client";

import { useSyncExternalStore } from "react";
import { daysFromNow } from "@/lib/data/dates";

/** Contact form messages, kept in memory only: a page refresh restores the sample list. */
export type StatutMessage = "New" | "Read" | "Handled";

export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  envoyeLe: string;
  statut: StatutMessage;
}

const SEED: ContactMessage[] = [
  { id: "msg-5", nom: "Karim Benali", email: "karim.benali@gmail.com", telephone: "+212 661 23 45 67", message: "Hello, I am looking for an automatic SUV from 12 to 20 October with delivery to Al Massira airport. What would the price be?", envoyeLe: daysFromNow(0, 9), statut: "New" },
  { id: "msg-4", nom: "Sophie Martin", email: "sophie.martin@orange.fr", telephone: "+33 6 12 34 56 78", message: "Is it possible to return the car in Marrakech instead of Agadir? We will be 4 adults with suitcases.", envoyeLe: daysFromNow(-1, 17), statut: "New" },
  { id: "msg-3", nom: "Youssef Alaoui", email: "y.alaoui@outlook.com", telephone: "+212 670 98 76 54", message: "Can the deposit be paid in cash? Please call me back.", envoyeLe: daysFromNow(-2, 11), statut: "Read" },
  { id: "msg-2", nom: "Thomas Keller", email: "thomas.keller@web.de", telephone: "+49 151 2345 6789", message: "Hello, do you accept international driving licences? I would like a Duster for one week in November.", envoyeLe: daysFromNow(-4, 14), statut: "Handled" },
  { id: "msg-1", nom: "Fatima Zahra Idrissi", email: "fz.idrissi@gmail.com", telephone: "+212 662 11 22 33", message: "Do you have a 9-seater van available for a wedding next weekend?", envoyeLe: daysFromNow(-6, 10), statut: "Handled" },
];

let messages = SEED;
const listeners = new Set<() => void>();

function set(next: ContactMessage[]) {
  messages = next;
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function addMessage(m: Pick<ContactMessage, "nom" | "email" | "telephone" | "message">) {
  set([{ ...m, id: `msg-${Date.now()}`, envoyeLe: new Date().toISOString(), statut: "New" }, ...messages]);
}

export function setMessageStatus(id: string, statut: StatutMessage) {
  set(messages.map((m) => (m.id === id ? { ...m, statut } : m)));
}

export function deleteMessage(id: string) {
  set(messages.filter((m) => m.id !== id));
}

export function useMessages() {
  return useSyncExternalStore(subscribe, () => messages, () => SEED);
}
