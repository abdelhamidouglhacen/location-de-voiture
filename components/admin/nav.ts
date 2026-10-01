import { CalendarDays, CalendarRange, Car, LayoutDashboard, Mail, Users } from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Bookings", Icon: CalendarDays },
  { href: "/admin/planning", label: "Planning", Icon: CalendarRange },
  { href: "/admin/voitures", label: "Cars", Icon: Car },
  { href: "/admin/clients", label: "Customers", Icon: Users },
  { href: "/admin/messages", label: "Messages", Icon: Mail },
];

export function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function titleFor(pathname: string) {
  return [...ADMIN_NAV].reverse().find((i) => isActive(pathname, i.href))?.label ?? "Administration";
}
