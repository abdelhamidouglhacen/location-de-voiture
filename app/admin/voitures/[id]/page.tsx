"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { Table } from "@/components/ui/Table";
import { useAdminCars } from "@/lib/adminCars";
import { bookingRows } from "@/lib/data/admin";
import { daysUntil, formatDate, formatMAD, formatNumber } from "@/lib/format";

export default function AdminCarPage() {
  const { id } = useParams<{ id: string }>();
  const car = useAdminCars().find((c) => c.id === id);
  if (!car) return <EmptyState title="Car not found" text="This car does not exist." action={<Button href="/admin/voitures">Back to cars</Button>} />;

  const history = bookingRows.filter((b) => b.voitureId === id);
  const done = history.filter((b) => b.statut !== "Cancelled");
  const revenue = done.filter((b) => b.statutPaiement === "Paid").reduce((s, b) => s + b.total, 0);
  const next = car.maintenance[0]?.prochainEntretien;

  return (
    <div className="space-y-6">
      <Link href="/admin/voitures" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Cars
      </Link>

      <div className="grid gap-6 md:grid-cols-[260px_1fr] md:items-center">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-sand">
          {car.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element -- admin photos may be data URLs or external links
            <img src={car.images[0]} alt="" className="size-full object-cover" />
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em]">
              {car.marque} {car.modele}
            </h2>
            <StatusBadge status={car.statut} />
            <Button href={`/admin/voitures/${car.id}/modifier`} variant="outline" size="sm" className="ml-auto">
              <Pencil className="size-3.5" aria-hidden />
              Edit
            </Button>
          </div>
          <p className="mt-1 text-muted tabular-nums">
            {car.categorie} · {car.annee} · {car.immatriculation} · {car.couleur}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue generated" value={revenue} format="mad" />
        <StatCard label="Rentals" value={done.length} />
        <StatCard label="Mileage" value={car.kilometrage} suffix=" km" />
        <StatCard label="Next service" value={next ? Math.max(0, daysUntil(next)) : 0} suffix=" days" hint={next ? `on ${formatDate(next)}` : undefined} />
      </div>

      <Card title="Booking history" padded={false}>
        <div className="pt-3">
          <Table
            caption="Booking history"
            rows={history}
            rowKey={(b) => b.id}
            empty={<EmptyState title="No bookings" text="This car has not been rented yet." />}
            columns={[
              {
                key: "ref",
                header: "Reference",
                render: (b) => (
                  <Link href={`/admin/reservations/${b.id}`} className="font-medium hover:underline">
                    {b.reference}
                  </Link>
                ),
              },
              { key: "client", header: "Customer", render: (b) => b.customer.nomComplet },
              { key: "dates", header: "Dates", render: (b) => `${formatDate(b.dateDepart)} → ${formatDate(b.dateRetour)}`, className: "tabular-nums" },
              { key: "total", header: "Total", render: (b) => formatMAD(b.total), className: "tabular-nums" },
              { key: "statut", header: "Status", render: (b) => <StatusBadge status={b.statut} /> },
            ]}
          />
        </div>
      </Card>

      <Card title="Service log" padded={false}>
        <div className="pt-3">
          <Table
            caption="Service log"
            rows={car.maintenance}
            rowKey={(m) => m.id}
            columns={[
              { key: "date", header: "Date", render: (m) => formatDate(m.date), className: "tabular-nums" },
              { key: "type", header: "Type", render: (m) => m.type },
              { key: "cout", header: "Cost", render: (m) => formatMAD(m.cout), className: "tabular-nums" },
              { key: "km", header: "Mileage", render: (m) => `${formatNumber(m.kilometrage)} km`, className: "tabular-nums" },
              { key: "next", header: "Next service", render: (m) => formatDate(m.prochainEntretien), className: "tabular-nums" },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}
