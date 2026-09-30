"use client";

import { useSyncExternalStore } from "react";
import { daysFromNow } from "@/lib/data/dates";

/** Contact form messages, kept in memory only: a page refresh restores the sample list. */
export type StatutMessage = "Nouveau" | "Lu" | "Traité";

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
  { id: "msg-5", nom: "Karim Benali", email: "karim.benali@gmail.com", telephone: "+212 661 23 45 67", message: "Bonjour, je cherche un SUV automatique du 12 au 20 octobre avec livraison à l'aéroport Al Massira. Quel serait le prix ?", envoyeLe: daysFromNow(0, 9), statut: "Nouveau" },
  { id: "msg-4", nom: "Sophie Martin", email: "sophie.martin@orange.fr", telephone: "+33 6 12 34 56 78", message: "Est-il possible de rendre la voiture à Marrakech au lieu d'Agadir ? Nous serons 4 adultes avec des valises.", envoyeLe: daysFromNow(-1, 17), statut: "Nouveau" },
  { id: "msg-3", nom: "Youssef Alaoui", email: "y.alaoui@outlook.com", telephone: "+212 670 98 76 54", message: "La caution peut-elle être payée en espèces ? Merci de me rappeler.", envoyeLe: daysFromNow(-2, 11), statut: "Lu" },
  { id: "msg-2", nom: "Thomas Keller", email: "thomas.keller@web.de", telephone: "+49 151 2345 6789", message: "Hello, do you accept international driving licences? I would like a Duster for one week in November.", envoyeLe: daysFromNow(-4, 14), statut: "Traité" },
  { id: "msg-1", nom: "Fatima Zahra Idrissi", email: "fz.idrissi@gmail.com", telephone: "+212 662 11 22 33", message: "Avez-vous un van 9 places disponible pour un mariage le week-end prochain ?", envoyeLe: daysFromNow(-6, 10), statut: "Traité" },
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
  set([{ ...m, id: `msg-${Date.now()}`, envoyeLe: new Date().toISOString(), statut: "Nouveau" }, ...messages]);
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
