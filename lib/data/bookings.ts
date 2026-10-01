import { addHours, parseISO } from "date-fns";
import type { Booking, BookingEvent, StatutPaiement, StatutReservation } from "@/types";
import { calculateDays, calculatePrice } from "@/lib/price";
import { cars } from "./cars";
import { customers } from "./customers";
import { daysFromNow } from "./dates";
import { extras } from "./extras";
import { locations } from "./locations";

/** Small seeded random generator so the mock data is the same on every load. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = seeded(2026);
const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];

interface BookingSeed {
  voitureId: string;
  clientId: string;
  depart: number;
  duree: number;
  heureDepart: number;
  heureRetour: number;
  statut: StatutReservation;
  statutPaiement?: StatutPaiement;
  options?: string[];
  notes?: string;
}

function history(statut: StatutReservation, creeLe: string, depart: string, retour: string): BookingEvent[] {
  const events: BookingEvent[] = [{ statut: "Pending", date: creeLe }];
  if (statut === "Cancelled") return [...events, { statut, date: addHours(parseISO(creeLe), 20).toISOString() }];
  if (statut === "Pending") return events;
  events.push({ statut: "Confirmed", date: addHours(parseISO(creeLe), 2).toISOString() });
  if (statut === "Ongoing" || statut === "Completed") events.push({ statut: "Ongoing", date: depart });
  if (statut === "Completed") events.push({ statut: "Completed", date: retour });
  return events;
}

function paymentStatus(statut: StatutReservation): StatutPaiement {
  if (statut === "Cancelled") return "Refunded";
  if (statut === "Pending") return "Pending";
  return "Paid";
}

function build(seed: BookingSeed, index: number): Booking {
  const car = cars.find((c) => c.id === seed.voitureId)!;
  const dateDepart = daysFromNow(seed.depart, seed.heureDepart);
  const dateRetour = daysFromNow(seed.depart + seed.duree, seed.heureRetour);
  const jours = calculateDays(parseISO(dateDepart), parseISO(dateRetour));
  const options = seed.options ?? [];
  const price = calculatePrice(car, jours, extras.filter((e) => options.includes(e.id)));
  // Booked a few days before departure, and never in the future.
  const creeLe = daysFromNow(Math.min(seed.depart - 3 - (index % 9), -1 - (index % 4)), 9 + (index % 8));
  const lieuDepartId = options.includes("livraison-aeroport") ? "aeroport" : locations[index % locations.length].id;
  const kmDepart = car.kilometrage - 4000 + index * 90;
  const finished = seed.statut === "Completed";
  const started = finished || seed.statut === "Ongoing";

  return {
    id: `b${index + 1}`,
    reference: `AZ-2026-${String(101 + index).padStart(4, "0")}`,
    clientId: seed.clientId,
    voitureId: seed.voitureId,
    lieuDepartId,
    lieuRetourId: index % 5 === 0 ? "aeroport" : lieuDepartId,
    dateDepart,
    dateRetour,
    options,
    nombreJours: price.jours,
    sousTotal: price.sousTotal,
    optionsTotal: price.optionsTotal,
    remise: price.remise,
    total: price.total,
    statut: seed.statut,
    statutPaiement: seed.statutPaiement ?? paymentStatus(seed.statut),
    modePaiement: index % 3 === 0 ? "carte" : "agence",
    numeroVol: lieuDepartId === "aeroport" ? `AT${400 + index * 7}` : undefined,
    notes: seed.notes ?? "",
    historique: history(seed.statut, creeLe, dateDepart, dateRetour),
    etatDepart: started ? { kilometrage: kmDepart, carburant: "Full", dommages: "None" } : undefined,
    etatRetour: finished
      ? { kilometrage: kmDepart + seed.duree * 140, carburant: "Full", dommages: index % 11 === 0 ? "Small scratch on rear bumper" : "None" }
      : undefined,
    creeLe,
  };
}

/** 31 finished or cancelled rentals spread over the last 6 months, no overlap per car. */
function pastSeeds(): BookingSeed[] {
  const busyUntil: Record<string, number> = {};
  const optionSets = [[], ["gps"], ["assurance"], ["siege-bebe", "assurance"], ["conducteur"], ["livraison-aeroport", "assurance"], []];
  return Array.from({ length: 31 }, (_, i) => {
    const depart = -178 + Math.round(i * 5.4);
    const duree = 2 + Math.floor(rand() * 7);
    let voitureId = pick(cars).id;
    while ((busyUntil[voitureId] ?? -999) >= depart) voitureId = pick(cars).id;
    busyUntil[voitureId] = depart + duree;
    const clientId = i === 6 || i === 19 ? "c1" : pick(customers.slice(1)).id;
    return {
      voitureId,
      clientId,
      depart,
      duree,
      heureDepart: 9 + Math.floor(rand() * 9),
      heureRetour: 9 + Math.floor(rand() * 9),
      statut: i % 10 === 4 ? "Cancelled" : "Completed",
      options: pick(optionSets),
    };
  });
}

/** Current and upcoming rentals, crafted so the dashboard and planning have activity today. */
const activeSeeds: BookingSeed[] = [
  { voitureId: "mercedes-gle", clientId: "c7", depart: -4, duree: 4, heureDepart: 11, heureRetour: 18, statut: "Ongoing", options: ["assurance", "gps"], notes: "VIP customer, return at the agency." },
  { voitureId: "hyundai-tucson", clientId: "c4", depart: -2, duree: 5, heureDepart: 15, heureRetour: 12, statut: "Ongoing", options: ["siege-bebe"] },
  { voitureId: "peugeot-208", clientId: "c12", depart: -6, duree: 5, heureDepart: 10, heureRetour: 10, statut: "Ongoing", notes: "Return was due yesterday, customer unreachable this morning." },
  { voitureId: "dacia-sandero", clientId: "c1", depart: -1, duree: 6, heureDepart: 9, heureRetour: 9, statut: "Ongoing", options: ["gps"] },
  { voitureId: "vw-t-roc", clientId: "c13", depart: 0, duree: 7, heureDepart: 14, heureRetour: 14, statut: "Confirmed", options: ["livraison-aeroport", "assurance"] },
  { voitureId: "renault-clio", clientId: "c2", depart: 0, duree: 3, heureDepart: 9, heureRetour: 9, statut: "Confirmed", statutPaiement: "Pending" },
  { voitureId: "range-rover-evoque", clientId: "c1", depart: 4, duree: 3, heureDepart: 10, heureRetour: 18, statut: "Confirmed", options: ["assurance"] },
  { voitureId: "dacia-duster", clientId: "c18", depart: 9, duree: 10, heureDepart: 12, heureRetour: 12, statut: "Pending", options: ["conducteur"] },
  { voitureId: "dacia-lodgy", clientId: "c22", depart: 15, duree: 8, heureDepart: 16, heureRetour: 10, statut: "Pending", options: ["siege-bebe", "gps"] },
];

export const bookings: Booking[] = [...pastSeeds(), ...activeSeeds].map(build);
