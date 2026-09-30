import { addDays, setHours, startOfDay } from "date-fns";

/** Mock data is anchored to today so the dashboard always has "current" activity. */
export const TODAY = startOfDay(new Date());

export function daysFromNow(days: number, hour = 10) {
  return setHours(addDays(TODAY, days), hour).toISOString();
}
