import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

type DateInput = Date | string;

const toDate = (d: DateInput) => (typeof d === "string" ? parseISO(d) : d);
const number = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export function formatMAD(amount: number) {
  return `${number.format(Math.round(amount))} MAD`;
}

export function formatNumber(n: number) {
  return number.format(n);
}

export function formatDate(d: DateInput) {
  return format(toDate(d), "dd/MM/yyyy", { locale: fr });
}

export function formatTime(d: DateInput) {
  return format(toDate(d), "HH:mm", { locale: fr });
}

export function formatDateTime(d: DateInput) {
  return format(toDate(d), "dd/MM/yyyy HH:mm", { locale: fr });
}

export function formatLongDate(d: DateInput) {
  return format(toDate(d), "EEEE d MMMM yyyy", { locale: fr });
}

/** Whole days from today until the given date (negative when it is past). */
export function daysUntil(d: DateInput) {
  return differenceInCalendarDays(toDate(d), new Date());
}
