# HG SELF DRIVE: location de voitures à Agadir

Frontend-only website for the HG SELF DRIVE car rental business, plus a minimal admin dashboard. The whole interface is in French and in light mode. There is no backend, no API, no database and no login.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4. Design tokens (colors, fonts, radii) live in `app/globals.css`
- Fonts: Sora (headings) and Geist (text), via `next/font`
- GSAP + `@gsap/react` for animations, react-day-picker + date-fns (French) for the calendar, Recharts for admin charts, lucide-react icons

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
```

Node 20.9 or newer is required.

## How booking works

1. The visitor clicks **Réserver** on a car card (or **Choisir mes dates** on the car page).
2. A calendar opens: they pick the rental dates and the pickup and return times, and see a price estimate.
3. They are sent to `/reservation?voiture=…&depart=…&retour=…`, a form for their details, pickup and return places, and options, with a live total.
4. On **Envoyer ma demande** the form is validated, then WhatsApp opens with the full request pre-filled for the agency (`wa.me/212697581510`). A printable summary is shown.

Because there is no backend, WhatsApp is how the request reaches the agency. To receive requests another way (e-mail, a form service, your own API), replace the `window.open(...)` call in `components/booking/ReservationForm.tsx`.

## Admin

`/admin` is open (no login) and read-only. It shows sample bookings, customers and cars from `lib/data/`: dashboard, bookings, planning, cars and clients. Filters and search work in the browser; nothing is saved. The sample dates are relative to today, so the dashboard always has activity to show.

Before going live, either keep `/admin` off the public site or put real authentication in front of it.

## Where things are

```
app/(site)/            public pages: accueil, voitures, voitures/[id], reservation, à propos, contact, conditions
app/admin/             admin pages
components/booking/    ReserveDialog (calendar), ReservationForm, PriceSummary, Receipt…
components/site/       Navbar, Hero, CarCard, CarCatalog, Footer…
components/admin/      Sidebar, charts, planning timeline
components/ui/         Button, Input, Select, Modal, Tabs, Table…
lib/data/              fleet (cars.ts), options, locations, sample admin data
lib/                   price, format, validation, constants (phones, WhatsApp, e-mail)
public/hg-self-drive-logo.png        brand logo (also app/icon.png for the favicon)
public/cars/           car photos + credits.json
```

To change the fleet or prices, edit `lib/data/cars.ts`. Business details (phones, e-mail, WhatsApp) are in `lib/constants.ts`.

## Notes

- The logo file provided is 81 × 81 px. Replace `public/hg-self-drive-logo.png` and `app/icon.png` with a larger version (512 px or more) for sharp rendering.
- The car photos come from Wikimedia Commons (free licenses, attribution required). Credits are in `public/cars/credits.json`. Replace them with your own fleet photos when you can.
# location-de-voiture
