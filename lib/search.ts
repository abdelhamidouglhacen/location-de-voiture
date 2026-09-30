import { format, isValid, parse } from "date-fns";
import { locations } from "./data/locations";

/** A rental search carried in the URL: /voitures?lieuDepart=…&lieuRetour=…&depart=…&retour=… */
export interface RentalSearch {
  depart: Date;
  retour: Date;
  lieuDepart?: string;
  lieuRetour?: string;
}

const PATTERN = "yyyy-MM-dd'T'HH:mm";

/** Local date-time for URLs, e.g. 2026-10-12T10:00. */
export const toParam = (d: Date) => format(d, PATTERN);

export function parseParam(value?: string | null) {
  if (!value) return undefined;
  const d = parse(value, PATTERN, new Date());
  return isValid(d) ? d : undefined;
}

const knownPlace = (id?: string | null) => (id && locations.some((l) => l.id === id) ? id : undefined);

export function searchQuery({ depart, retour, lieuDepart, lieuRetour }: RentalSearch) {
  const params = new URLSearchParams({ depart: toParam(depart), retour: toParam(retour) });
  if (lieuDepart) params.set("lieuDepart", lieuDepart);
  if (lieuRetour) params.set("lieuRetour", lieuRetour);
  return params.toString();
}

/** Reads a search from URL params; returns undefined when dates are missing, reversed or in the past. */
export function readSearch(get: (key: string) => string | null | undefined): RentalSearch | undefined {
  const depart = parseParam(get("depart"));
  const retour = parseParam(get("retour"));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!depart || !retour || retour <= depart || depart < today) return undefined;
  return { depart, retour, lieuDepart: knownPlace(get("lieuDepart")), lieuRetour: knownPlace(get("lieuRetour")) };
}

export function withTime(day: Date, time: string) {
  const d = new Date(day);
  const [h, m] = time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}
