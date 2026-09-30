/**
 * Read-only sample data for the admin dashboard, joined and summarised in the browser.
 * There is no database: nothing here is saved.
 */
import { addDays, addMonths, addWeeks, eachDayOfInterval, eachWeekOfInterval, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import type { Booking, Car, Customer } from "@/types";
import { bookings } from "./bookings";
import { cars } from "./cars";
import { customers } from "./customers";
import { TODAY } from "./dates";

export type BookingRow = Booking & { car: Car; customer: Customer };

const carById = new Map(cars.map((c) => [c.id, c]));
const customerById = new Map(customers.map((c) => [c.id, c]));

export const bookingRows: BookingRow[] = bookings
  .map((b) => ({ ...b, car: carById.get(b.voitureId)!, customer: customerById.get(b.clientId)! }))
  .sort((a, b) => b.dateDepart.localeCompare(a.dateDepart));

export const customerRows: Customer[] = customers.map((c) => {
  const own = bookings.filter((b) => b.clientId === c.id && b.statut !== "Annulée");
  return {
    ...c,
    nombreLocations: own.length,
    totalDepense: own.filter((b) => b.statutPaiement === "Payé").reduce((s, b) => s + b.total, 0),
  };
});

export function findBooking(id: string) {
  return bookingRows.find((b) => b.id === id);
}

export function findCustomer(id: string) {
  return customerRows.find((c) => c.id === id);
}

const paid = bookingRows.filter((b) => b.statut !== "Annulée" && b.statutPaiement === "Payé");
const revenueIn = (month: Date) => paid.filter((b) => isSameMonth(parseISO(b.dateDepart), month)).reduce((s, b) => s + b.total, 0);

export type RevenuePeriod = "semaine" | "mois" | "3mois" | "6mois";

type Bucket = { label: string; from: Date; to: Date };

/** Week and month are split by day, 3 months by week, 6 months by month. */
function bucketsFor(period: RevenuePeriod): Bucket[] {
  if (period === "semaine" || period === "mois") {
    const start = period === "semaine" ? startOfWeek(TODAY, { weekStartsOn: 1 }) : startOfMonth(TODAY);
    const end = period === "semaine" ? addDays(start, 7) : addMonths(start, 1);
    return eachDayOfInterval({ start, end: addDays(end, -1) }).map((day) => ({
      label: format(day, period === "semaine" ? "EEE d" : "d MMM", { locale: fr }),
      from: day,
      to: addDays(day, 1),
    }));
  }
  if (period === "3mois") {
    const start = startOfWeek(subMonths(startOfMonth(TODAY), 2), { weekStartsOn: 1 });
    const end = addMonths(startOfMonth(TODAY), 1);
    return eachWeekOfInterval({ start, end: addDays(end, -1) }, { weekStartsOn: 1 }).map((week) => ({
      label: format(week, "d MMM", { locale: fr }),
      from: week,
      to: addWeeks(week, 1),
    }));
  }
  const thisMonth = startOfMonth(TODAY);
  return Array.from({ length: 6 }, (_, i) => {
    const month = addMonths(subMonths(thisMonth, 5), i);
    return { label: format(month, "MMM", { locale: fr }), from: month, to: addMonths(month, 1) };
  });
}

const departsIn = (list: BookingRow[], from: Date, to: Date) =>
  list.filter((b) => {
    const d = parseISO(b.dateDepart);
    return d >= from && d < to;
  });

const booked = bookingRows.filter((b) => b.statut !== "Annulée");

export function revenueSeries(period: RevenuePeriod): { label: string; total: number }[] {
  return bucketsFor(period).map(({ label, from, to }) => ({ label, total: departsIn(paid, from, to).reduce((s, b) => s + b.total, 0) }));
}

/** Non-cancelled bookings, counted on their departure date like revenue. */
export function bookingsSeries(period: RevenuePeriod): { label: string; total: number }[] {
  return bucketsFor(period).map(({ label, from, to }) => ({ label, total: departsIn(booked, from, to).length }));
}

/** Most booked cars over the period: the top 4, the rest grouped as "Autres". */
export function topCars(period: RevenuePeriod): { name: string; total: number }[] {
  const buckets = bucketsFor(period);
  const inPeriod = departsIn(booked, buckets[0].from, buckets[buckets.length - 1].to);
  const counts = new Map<string, number>();
  for (const b of inPeriod) {
    const name = `${b.car.marque} ${b.car.modele}`;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const sorted = [...counts].map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  const rest = sorted.slice(4).reduce((s, c) => s + c.total, 0);
  return rest ? [...sorted.slice(0, 4), { name: "Autres", total: rest }] : sorted;
}

export function dashboardSummary() {
  const thisMonth = startOfMonth(TODAY);
  const revenue = revenueIn(thisMonth);
  const previous = revenueIn(subMonths(thisMonth, 1));
  const active = bookingRows.filter((b) => b.statut !== "Annulée");

  return {
    kpis: {
      revenue,
      revenueChange: previous ? ((revenue - previous) / previous) * 100 : 0,
      enCours: bookingRows.filter((b) => b.statut === "En cours").length,
      aConfirmer: bookingRows.filter((b) => b.statut === "En attente").length,
      disponibles: cars.filter((c) => c.statut === "Disponible").length,
      totalVoitures: cars.length,
    },
    byCategory: ["Économique", "Citadine", "SUV", "Luxe", "Van"].map((categorie) => ({
      name: categorie,
      total: active.filter((b) => b.car.categorie === categorie).length,
    })),
    today: [
      ...bookingRows.filter((b) => b.statut === "Confirmée" && isSameDay(parseISO(b.dateDepart), TODAY)).map((b) => ({ type: "Départ" as const, heure: b.dateDepart, booking: b })),
      ...bookingRows.filter((b) => b.statut === "En cours" && isSameDay(parseISO(b.dateRetour), TODAY)).map((b) => ({ type: "Retour" as const, heure: b.dateRetour, booking: b })),
    ].sort((a, b) => a.heure.localeCompare(b.heure)),
    latest: [...bookingRows].sort((a, b) => b.creeLe.localeCompare(a.creeLe)).slice(0, 6),
  };
}
