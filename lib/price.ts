import { differenceInHours } from "date-fns";
import type { Car, Extra } from "@/types";

export function calculateDays(depart: Date, retour: Date) {
  const hours = differenceInHours(retour, depart);
  return Math.max(1, Math.ceil(hours / 24));
}

/** Weekly and monthly rates apply automatically for long rentals. */
export function dailyRate(car: Car, days: number) {
  if (days >= 30) return car.prixParMois / 30;
  if (days >= 7) return car.prixParSemaine / 7;
  return car.prixParJour;
}

export function extrasTotal(extras: Extra[], days: number) {
  return extras.reduce((sum, e) => sum + (e.unite === "jour" ? e.prix * days : e.prix), 0);
}

export interface PriceBreakdown {
  jours: number;
  sousTotal: number;
  optionsTotal: number;
  remise: number;
  total: number;
}

export function calculatePrice(car: Car, days: number, extras: Extra[]): PriceBreakdown {
  const sousTotal = car.prixParJour * days;
  const remise = Math.round(sousTotal - dailyRate(car, days) * days);
  const optionsTotal = extrasTotal(extras, days);
  return { jours: days, sousTotal, optionsTotal, remise, total: sousTotal - remise + optionsTotal };
}
