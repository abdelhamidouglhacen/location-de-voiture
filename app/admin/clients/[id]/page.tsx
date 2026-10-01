"use client";

import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatCard } from "@/components/admin/StatCard";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { Table } from "@/components/ui/Table";
import { bookingRows, findCustomer } from "@/lib/data/admin";
import { daysUntil, formatDate, formatMAD } from "@/lib/format";

export default function ClientPage() {
  const { id } = useParams<{ id: string }>();
  const customer = findCustomer(id);
  if (!customer) return <EmptyState title="Customer not found" text="This customer does not exist." action={<Button href="/admin/clients">Back to customers</Button>} />;

  const history = bookingRows.filter((b) => b.clientId === id);
  const expired = daysUntil(customer.expirationPermis) < 0;

  return (
    <div className="space-y-6">
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Customers
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.02em]">{customer.nomComplet}</h2>
          {customer.listeNoire && <Badge tone="red">Blacklisted</Badge>}
        </div>
        <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
          <a href={`tel:${customer.telephone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 tabular-nums hover:text-ink">
            <Phone className="size-4" aria-hidden />
            {customer.telephone}
          </a>
          <a href={`mailto:${customer.email}`} className="inline-flex items-center gap-1.5 hover:text-ink">
            <Mail className="size-4" aria-hidden />
            {customer.email}
          </a>
          <span>
            {customer.nationalite}, {customer.age} years old
          </span>
        </p>
        {customer.raisonListeNoire && <p className="mt-3 text-sm text-red-800">{customer.raisonListeNoire}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total spent" value={customer.totalDepense} format="mad" />
        <StatCard label="Rentals" value={customer.nombreLocations} />
        <div className="rounded-[20px] border border-line bg-surface p-5">
          <p className="text-sm text-muted">ID document</p>
          <p className="mt-3 font-medium tabular-nums">{customer.pieceIdentite}</p>
        </div>
        <div className="rounded-[20px] border border-line bg-surface p-5">
          <p className="text-sm text-muted">Driving licence</p>
          <p className="mt-3 font-medium tabular-nums">{customer.numeroPermis}</p>
          <p className={expired ? "mt-1 text-xs font-medium text-red-700" : "mt-1 text-xs text-muted"}>
            {expired ? "Expired on" : "Expires on"} {formatDate(customer.expirationPermis)}
          </p>
        </div>
      </div>

      <Card title="Rental history" padded={false}>
        <div className="pt-3">
          <Table
            caption="Rental history"
            rows={history}
            rowKey={(b) => b.id}
            empty={<EmptyState title="No rentals" text="This customer has not rented a car yet." />}
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
              { key: "voiture", header: "Car", render: (b) => `${b.car.marque} ${b.car.modele}` },
              { key: "dates", header: "Dates", render: (b) => `${formatDate(b.dateDepart)} → ${formatDate(b.dateRetour)}`, className: "tabular-nums" },
              { key: "total", header: "Total", render: (b) => formatMAD(b.total), className: "tabular-nums" },
              { key: "statut", header: "Status", render: (b) => <StatusBadge status={b.statut} /> },
            ]}
          />
        </div>
      </Card>

      {customer.notes && (
        <Card title="Notes">
          <p className="text-sm text-ink-2">{customer.notes}</p>
        </Card>
      )}
    </div>
  );
}
