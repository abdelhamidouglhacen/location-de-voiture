"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookingsChart } from "@/components/admin/BookingsChart";
import { CategoryChart } from "@/components/admin/CategoryChart";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatCard } from "@/components/admin/StatCard";
import { TodaySchedule } from "@/components/admin/TodaySchedule";
import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { bookingsSeries, dashboardSummary, type RevenuePeriod, revenueSeries, topCars } from "@/lib/data/admin";
import { formatDate, formatMAD } from "@/lib/format";

const PERIODS = [
  { value: "semaine", label: "Cette semaine" },
  { value: "mois", label: "Ce mois" },
  { value: "3mois", label: "3 mois" },
  { value: "6mois", label: "6 mois" },
];

export default function DashboardPage() {
  const { kpis, byCategory, today, latest } = dashboardSummary();
  const [period, setPeriod] = useState<RevenuePeriod>("6mois");
  const revenue = useMemo(() => revenueSeries(period), [period]);
  const [bookingPeriod, setBookingPeriod] = useState<RevenuePeriod>("6mois");
  const bookings = useMemo(() => bookingsSeries(bookingPeriod), [bookingPeriod]);
  const cars = useMemo(() => topCars(bookingPeriod), [bookingPeriod]);

  return (
    <div className="space-y-6">
      <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenus du mois" value={kpis.revenue} format="mad" change={kpis.revenueChange} hint="vs mois dernier" />
        <StatCard label="Locations en cours" value={kpis.enCours} />
        <StatCard label="Demandes à confirmer" value={kpis.aConfirmer} />
        <StatCard label="Voitures disponibles" value={kpis.disponibles} suffix={` / ${kpis.totalVoitures}`} />
      </StaggerGroup>

      <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <Card
          title="Revenus"
          className="lg:col-span-2"
          action={<Tabs label="Période des revenus" value={period} onChange={(v) => setPeriod(v as RevenuePeriod)} tabs={PERIODS} />}
        >
          <RevenueChart data={revenue} />
        </Card>
        <Card title="Par catégorie">
          <CategoryChart data={byCategory} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <Card
          title="Réservations"
          className="lg:col-span-2"
          action={<Tabs label="Période des réservations" value={bookingPeriod} onChange={(v) => setBookingPeriod(v as RevenuePeriod)} tabs={PERIODS} />}
        >
          <BookingsChart data={bookings} />
        </Card>
        <Card title="Voitures les plus louées">
          {cars.length ? <CategoryChart data={cars} /> : <p className="py-10 text-center text-sm text-muted">Aucune réservation sur cette période.</p>}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr] [&>*]:min-w-0">
        <Card title="Aujourd'hui">
          <TodaySchedule items={today} />
        </Card>
        <Card
          title="Dernières réservations"
          padded={false}
          action={
            <Link href="/admin/reservations" className="text-sm text-muted hover:text-ink">
              Tout voir
            </Link>
          }
        >
          <div className="pt-3 pb-1">
            <Table
              caption="Dernières réservations"
              rows={latest}
              rowKey={(b) => b.id}
              columns={[
                {
                  key: "ref",
                  header: "Référence",
                  className: "whitespace-nowrap",
                  render: (b) => (
                    <Link href={`/admin/reservations/${b.id}`} className="font-medium hover:underline">
                      {b.reference}
                    </Link>
                  ),
                },
                { key: "client", header: "Client", render: (b) => b.customer.nomComplet },
                { key: "voiture", header: "Voiture", render: (b) => `${b.car.marque} ${b.car.modele}` },
                { key: "depart", header: "Départ", render: (b) => formatDate(b.dateDepart), className: "tabular-nums" },
                { key: "total", header: "Total", render: (b) => formatMAD(b.total), className: "text-right tabular-nums whitespace-nowrap" },
                { key: "statut", header: "Statut", render: (b) => <StatusBadge status={b.statut} /> },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
