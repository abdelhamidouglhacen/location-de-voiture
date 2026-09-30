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
const STATUTS = ["En attente", "Confirmée", "En cours", "Terminée", "Annulée"];

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
          label="Filtrer par statut"
          value={statut}
          onChange={(v) => {
            setStatut(v);
            setPage(1);
          }}
          tabs={[
            { value: "tous", label: "Toutes", count: bookingRows.length },
            ...STATUTS.map((s) => ({ value: s, label: s, count: bookingRows.filter((b) => b.statut === s).length })),
          ]}
        />
        <Input
          id="res-q"
          aria-label="Rechercher une réservation"
          icon={<Search className="size-4" />}
          placeholder="Référence, client, voiture"
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
          caption="Réservations"
          rows={filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)}
          rowKey={(b) => b.id}
          empty={<EmptyState title="Aucune réservation" text="Aucune réservation ne correspond à cette recherche." />}
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
            {
              key: "client",
              header: "Client",
              render: (b) => (
                <>
                  <span className="block">{b.customer.nomComplet}</span>
                  <span className="text-xs text-muted tabular-nums">{b.customer.telephone}</span>
                </>
              ),
            },
            { key: "voiture", header: "Voiture", render: (b) => `${b.car.marque} ${b.car.modele}` },
            { key: "dates", header: "Dates", render: (b) => `${formatDate(b.dateDepart)} → ${formatDate(b.dateRetour)}`, className: "whitespace-nowrap tabular-nums" },
            { key: "total", header: "Total", render: (b) => formatMAD(b.total), className: "whitespace-nowrap text-right tabular-nums" },
            { key: "paiement", header: "Paiement", render: (b) => <StatusBadge status={b.statutPaiement} /> },
            { key: "statut", header: "Statut", render: (b) => <StatusBadge status={b.statut} /> },
          ]}
        />
        <Pagination page={current} pageCount={pageCount} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
      </Card>
    </div>
  );
}
