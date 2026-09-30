"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { Table } from "@/components/ui/Table";
import { customerRows } from "@/lib/data/admin";
import { formatMAD } from "@/lib/format";

const PAGE_SIZE = 12;
const sorted = [...customerRows].sort((a, b) => b.totalDepense - a.totalDepense);

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return sorted.filter((c) => !term || [c.nomComplet, c.email, c.telephone, c.nationalite].some((v) => v.toLowerCase().includes(term)));
  }, [q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="text-muted">{filtered.length} clients</p>
        <Input
          id="clients-q"
          aria-label="Rechercher un client"
          icon={<Search className="size-4" />}
          placeholder="Nom, e-mail, téléphone"
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
          caption="Clients"
          rows={filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)}
          rowKey={(c) => c.id}
          empty={<EmptyState title="Aucun client" text="Aucun client ne correspond à cette recherche." />}
          columns={[
            {
              key: "nom",
              header: "Client",
              render: (c) => (
                <Link href={`/admin/clients/${c.id}`} className="hover:underline">
                  <span className="block font-medium">{c.nomComplet}</span>
                  <span className="text-xs text-muted">{c.email}</span>
                </Link>
              ),
            },
            { key: "tel", header: "Téléphone", render: (c) => c.telephone, className: "whitespace-nowrap tabular-nums" },
            { key: "nat", header: "Nationalité", render: (c) => c.nationalite },
            { key: "loc", header: "Locations", render: (c) => c.nombreLocations, className: "tabular-nums" },
            { key: "total", header: "Total dépensé", render: (c) => formatMAD(c.totalDepense), className: "whitespace-nowrap text-right tabular-nums" },
            { key: "statut", header: "", render: (c) => c.listeNoire && <Badge tone="red">Liste noire</Badge> },
          ]}
        />
        <Pagination page={current} pageCount={pageCount} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
      </Card>
    </div>
  );
}
