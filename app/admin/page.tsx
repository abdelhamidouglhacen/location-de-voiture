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
  { value: "semaine", label: "This week" },
  { value: "mois", label: "This month" },
  { value: "3mois", label: "3 months" },
  { value: "6mois", label: "6 months" },
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
        <StatCard label="Revenue this month" value={kpis.revenue} format="mad" change={kpis.revenueChange} hint="vs last month" />
        <StatCard label="Ongoing rentals" value={kpis.enCours} />
        <StatCard label="Requests to confirm" value={kpis.aConfirmer} />
        <StatCard label="Available cars" value={kpis.disponibles} suffix={` / ${kpis.totalVoitures}`} />
      </StaggerGroup>

      <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <Card
          title="Revenue"
          className="lg:col-span-2"
          action={<Tabs label="Revenue period" value={period} onChange={(v) => setPeriod(v as RevenuePeriod)} tabs={PERIODS} />}
        >
          <RevenueChart data={revenue} />
        </Card>
        <Card title="By category">
          <CategoryChart data={byCategory} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <Card
          title="Bookings"
          className="lg:col-span-2"
          action={<Tabs label="Bookings period" value={bookingPeriod} onChange={(v) => setBookingPeriod(v as RevenuePeriod)} tabs={PERIODS} />}
        >
          <BookingsChart data={bookings} />
        </Card>
        <Card title="Most rented cars">
          {cars.length ? <CategoryChart data={cars} /> : <p className="py-10 text-center text-sm text-muted">No bookings in this period.</p>}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr] [&>*]:min-w-0">
        <Card title="Today">
          <TodaySchedule items={today} />
        </Card>
        <Card
          title="Latest bookings"
          padded={false}
          action={
            <Link href="/admin/reservations" className="text-sm text-muted hover:text-ink">
              View all
            </Link>
          }
        >
          <div className="pt-3 pb-1">
            <Table
              caption="Latest bookings"
              rows={latest}
              rowKey={(b) => b.id}
              columns={[
                {
                  key: "ref",
                  header: "Reference",
                  className: "whitespace-nowrap",
                  render: (b) => (
                    <Link href={`/admin/reservations/${b.id}`} className="font-medium hover:underline">
                      {b.reference}
                    </Link>
                  ),
                },
                { key: "client", header: "Customer", render: (b) => b.customer.nomComplet },
                { key: "voiture", header: "Car", render: (b) => `${b.car.marque} ${b.car.modele}` },
                { key: "depart", header: "Pick-up", render: (b) => formatDate(b.dateDepart), className: "tabular-nums" },
                { key: "total", header: "Total", render: (b) => formatMAD(b.total), className: "text-right tabular-nums whitespace-nowrap" },
                { key: "statut", header: "Status", render: (b) => <StatusBadge status={b.statut} /> },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
