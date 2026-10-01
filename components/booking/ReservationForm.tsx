"use client";

import { CalendarCheck, CircleCheck, Home, Printer, Send } from "lucide-react";
import { useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { BUSINESS, whatsappLink } from "@/lib/constants";
import { formatDateTime, formatMAD } from "@/lib/format";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { saveBooking } from "@/lib/myBookings";
import type { RentalSearch } from "@/lib/search";
import { calculateDays, calculatePrice } from "@/lib/price";
import { hasErrors, type Errors } from "@/lib/validation";
import type { Car, DriverInfo, Extra, Location } from "@/types";
import { DriverForm, validateDriver } from "./DriverForm";
import { ExtrasList } from "./ExtrasList";
import { PriceSummary } from "./PriceSummary";
import { Receipt, type RequestSummary } from "./Receipt";
import { ReserveDialog } from "./ReserveDialog";

const emptyDriver: DriverInfo = {
  nomComplet: "",
  email: "",
  telephone: "",
  age: "",
  numeroPermis: "",
  expirationPermis: "",
  pieceIdentite: "",
  numeroVol: "",
  remarques: "",
};

interface Props {
  car: Car;
  search: RentalSearch;
  extras: Extra[];
  locations: Location[];
}

function whatsappMessage(s: RequestSummary) {
  return [
    `Hello ${BUSINESS.name}, here is my booking request (${s.reference}):`,
    ``,
    `Car: ${s.car.marque} ${s.car.modele}`,
    `Pick-up: ${formatDateTime(s.depart)}, ${s.lieuDepart}`,
    `Return: ${formatDateTime(s.retour)}, ${s.lieuRetour}`,
    `Extras: ${s.options.map((o) => o.nom).join(", ") || "none"}`,
    `Estimated total: ${formatMAD(s.price.total)}`,
    ``,
    `Driver: ${s.driver.nomComplet}, ${s.driver.age} years old`,
    `Phone: ${s.driver.telephone}`,
    `Email: ${s.driver.email}`,
    `ID card / passport: ${s.driver.pieceIdentite}`,
    `Licence: ${s.driver.numeroPermis} (expires ${s.driver.expirationPermis})`,
    s.driver.numeroVol ? `Flight: ${s.driver.numeroVol}` : null,
    s.driver.remarques ? `Notes: ${s.driver.remarques}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function ReservationForm({ car, search, extras, locations }: Props) {
  const { depart, retour } = search;
  const [driver, setDriver] = useState<DriverInfo>(emptyDriver);
  const [errors, setErrors] = useState<Errors<DriverInfo>>({});
  const [lieuDepart, setLieuDepart] = useState(search.lieuDepart ?? locations[0].id);
  const [lieuRetour, setLieuRetour] = useState(search.lieuRetour ?? search.lieuDepart ?? locations[0].id);
  const [options, setOptions] = useState<string[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string>();
  const [sent, setSent] = useState<RequestSummary | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const days = calculateDays(depart, retour);
  const selected = extras.filter((e) => options.includes(e.id));
  const price = calculatePrice(car, days, selected);
  const locationOptions = locations.map((l) => ({ value: l.id, label: l.nom }));
  const lieu = (id: string) => locations.find((l) => l.id === id)!.nom;
  const name = `${car.marque} ${car.modele}`;

  useGSAP(
    () => {
      const svg = doneRef.current?.querySelector("svg");
      if (!svg) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        const strokes = svg.querySelectorAll<SVGGeometryElement>("path, circle");
        strokes.forEach((el) => {
          const length = el.getTotalLength();
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap
          .timeline()
          .to(strokes, { strokeDashoffset: 0, duration: 0.6, stagger: 0.3, ease: "power2.inOut" })
          .fromTo(svg, { scale: 0.85 }, { scale: 1, duration: 0.6, ease: "back.out(3)" }, "-=0.1");
      });
    },
    { dependencies: [!!sent], scope: doneRef },
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateDriver(driver);
    setErrors(found);
    setTermsError(accepted ? undefined : "You must accept the rental terms.");
    if (hasErrors(found) || !accepted) {
      document.querySelector<HTMLElement>("[aria-invalid='true'], #resa-conditions")?.focus();
      return;
    }
    const summary: RequestSummary = {
      reference: `AZ-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      car,
      driver,
      depart,
      retour,
      lieuDepart: lieu(lieuDepart),
      lieuRetour: lieu(lieuRetour),
      options: selected,
      price,
    };
    const message = whatsappMessage(summary);
    saveBooking({
      reference: summary.reference,
      carId: car.id,
      carName: name,
      image: car.images[0],
      depart: depart.toISOString(),
      retour: retour.toISOString(),
      lieuDepart: summary.lieuDepart,
      lieuRetour: summary.lieuRetour,
      options: selected.map((o) => o.nom),
      jours: price.jours,
      total: price.total,
      caution: car.caution,
      conducteur: driver.nomComplet.trim(),
      telephone: driver.telephone.trim(),
      envoyeLe: new Date().toISOString(),
      message,
    });
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSent(summary);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (sent) {
    return (
      <div ref={doneRef} className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="no-print text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-full bg-accent-soft">
            <CircleCheck className="size-14 text-accent-deep" strokeWidth={1.5} aria-hidden />
          </div>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Request ready!</h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
            Thank you {driver.nomComplet.split(" ")[0]}. Your request has opened in WhatsApp: press “Send” to pass it on to the agency. We will
            call you back to confirm.
          </p>
        </div>
        <div className="mt-10">
          <Receipt {...sent} />
        </div>
        <div className="no-print mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={whatsappLink(whatsappMessage(sent))} target="_blank" rel="noopener noreferrer" variant="accent">
            <WhatsAppIcon className="size-4" />
            Reopen WhatsApp
          </Button>
          <Button onClick={() => window.print()} variant="outline">
            <Printer className="size-4" aria-hidden />
            Print
          </Button>
          <Button href="/mes-reservations" variant="outline">
            <CalendarCheck className="size-4" aria-hidden />
            My bookings
          </Button>
          <Button href="/" variant="outline">
            <Home className="size-4" aria-hidden />
            Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:py-14">
      <div className="min-w-0 space-y-12">
        <Section title="Pick-up and return" text="Where would you like to collect and return the car?">
          <div className="grid gap-5 sm:grid-cols-2">
            <Select id="resa-lieu-depart" label="Pick-up place" options={locationOptions} value={lieuDepart} onChange={(e) => setLieuDepart(e.target.value)} />
            <Select id="resa-lieu-retour" label="Return place" options={locationOptions} value={lieuRetour} onChange={(e) => setLieuRetour(e.target.value)} />
          </div>
        </Section>

        <Section title="Your details" text="They will appear on the rental contract.">
          <DriverForm
            value={driver}
            errors={errors}
            onChange={(patch) => {
              setDriver({ ...driver, ...patch });
              setErrors((e) => ({ ...e, ...Object.fromEntries(Object.keys(patch).map((k) => [k, undefined])) }));
            }}
          />
        </Section>

        <Section title="Extras" text="Optional. The total updates straight away.">
          <ExtrasList extras={extras} selected={options} days={days} onToggle={(id) => setOptions(options.includes(id) ? options.filter((o) => o !== id) : [...options, id])} />
        </Section>

        <div className="space-y-6 border-t border-line pt-8">
          <Checkbox
            id="resa-conditions"
            checked={accepted}
            error={termsError}
            onChange={(e) => {
              setAccepted(e.target.checked);
              setTermsError(undefined);
            }}
            label={
              <>
                I accept the{" "}
                <a href="/conditions" target="_blank" className="font-medium underline underline-offset-2">
                  rental terms
                </a>{" "}
                of AZUR DRIVE.
              </>
            }
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-sm text-muted">Your request will open in WhatsApp, ready to send to the agency. No online payment.</p>
            <Button type="submit" size="lg">
              <Send className="size-4" aria-hidden />
              Send my request
            </Button>
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Booking summary">
        <PriceSummary
          car={car}
          price={price}
          extras={selected}
          depart={depart}
          retour={retour}
          action={<ReserveDialog car={{ id: car.id, name, prixParJour: car.prixParJour }} initial={{ depart, retour }} places={{ lieuDepart, lieuRetour }} label="Change dates" variant="outline" className="w-full" />}
        />
      </aside>
    </form>
  );
}

function Section({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-muted">{text}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
