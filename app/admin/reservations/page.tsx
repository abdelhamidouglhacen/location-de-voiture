"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { Table } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { useBookingRows } from "@/lib/adminBookings";
import { formatDate, formatMAD } from "@/lib/format";

const PAGE_SIZE = 12;
const STATUTS = ["Pending", "Confirmed", "Ongoing", "Completed", "Cancelled"];

export default function ReservationsPage() {
  const bookingRows = useBookingRows();
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState("tous");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return bookingRows.filter(
      (b) =>
        (statut === "tous" || b.statut === statut) &&
        (!term || [b.reference, b.customer.nomComplet, b.customer.telephone, `${b.car.marque} ${b.car.modele}`].some((v) => v.toLowerCase().includes(term))),
    );
  }, [q, statut, bookingRows]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Tabs
          label="Filter by status"
          value={statut}
          onChange={(v) => {
            setStatut(v);
            setPage(1);
          }}
          tabs={[
            { value: "tous", label: "All", count: bookingRows.length },
            ...STATUTS.map((s) => ({ value: s, label: s, count: bookingRows.filter((b) => b.statut === s).length })),
          ]}
        />
        <Input
          id="res-q"
          aria-label="Search bookings"
          icon={<Search className="size-4" />}
          placeholder="Reference, customer, car"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          wrapperClassName="w-full sm:w-72"
        />
      </div>

      <Card padded={false}>
        <Table
          caption="Bookings"
          rows={filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)}
          rowKey={(b) => b.id}
          empty={<EmptyState title="No bookings" text="No bookings match this search." />}
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
            {
              key: "client",
              header: "Customer",
              render: (b) => (
                <>
                  <span className="block">{b.customer.nomComplet}</span>
                  <span className="text-xs text-muted tabular-nums">{b.customer.telephone}</span>
                </>
              ),
            },
            { key: "voiture", header: "Car", render: (b) => `${b.car.marque} ${b.car.modele}` },
            { key: "dates", header: "Dates", render: (b) => `${formatDate(b.dateDepart)} → ${formatDate(b.dateRetour)}`, className: "whitespace-nowrap tabular-nums" },
            { key: "total", header: "Total", render: (b) => formatMAD(b.total), className: "whitespace-nowrap text-right tabular-nums" },
            { key: "paiement", header: "Payment", render: (b) => <StatusBadge status={b.statutPaiement} /> },
            { key: "statut", header: "Status", render: (b) => <StatusBadge status={b.statut} /> },
          ]}
        />
        <Pagination page={current} pageCount={pageCount} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
      </Card>
    </div>
  );
}
