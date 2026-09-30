"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/States";
import { Table } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { deleteCar, useAdminCars } from "@/lib/adminCars";
import { formatMAD, formatNumber } from "@/lib/format";
import type { Car } from "@/types";

const STATUTS = ["Disponible", "Louée", "En maintenance"] as const;

export default function AdminCarsPage() {
  const cars = useAdminCars();
  const toast = useToast();
  const [statut, setStatut] = useState("toutes");
  const [toDelete, setToDelete] = useState<Car | null>(null);
  const list = cars.filter((c) => statut === "toutes" || c.statut === statut);

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteCar(toDelete.id);
    toast(`${toDelete.marque} ${toDelete.modele} supprimée.`);
    setToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs
          label="Filtrer par statut"
          value={statut}
          onChange={setStatut}
          tabs={[{ value: "toutes", label: "Toutes", count: cars.length }, ...STATUTS.map((s) => ({ value: s, label: s, count: cars.filter((c) => c.statut === s).length }))]}
        />
        <Button href="/admin/voitures/nouvelle">
          <Plus className="size-4" aria-hidden />
          Ajouter une voiture
        </Button>
      </div>

      <Card padded={false}>
        <Table
          caption="Liste des voitures"
          rows={list}
          rowKey={(c) => c.id}
          empty={<EmptyState title="Aucune voiture" text="Aucune voiture ne correspond à ce filtre." />}
          columns={[
            {
              key: "voiture",
              header: "Voiture",
              render: (c) => (
                <Link href={`/admin/voitures/${c.id}`} className="flex items-center gap-3 hover:underline">
                  <span className="relative h-12 w-18 shrink-0 overflow-hidden rounded-lg bg-sand">
                    {c.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element -- admin photos may be data URLs or external links
                      <img src={c.images[0]} alt="" className="size-full object-cover" />
                    )}
                  </span>
                  <span>
                    <span className="block font-medium">
                      {c.marque} {c.modele}
                    </span>
                    <span className="block text-xs text-muted">
                      {c.categorie} · {c.annee}
                    </span>
                  </span>
                </Link>
              ),
            },
            { key: "immat", header: "Immatriculation", render: (c) => c.immatriculation, className: "tabular-nums" },
            { key: "km", header: "Kilométrage", render: (c) => `${formatNumber(c.kilometrage)} km`, className: "tabular-nums" },
            { key: "prix", header: "Prix / jour", render: (c) => formatMAD(c.prixParJour), className: "tabular-nums" },
            { key: "statut", header: "Statut", render: (c) => <StatusBadge status={c.statut} /> },
            {
              key: "actions",
              header: "Actions",
              className: "text-right",
              render: (c) => (
                <div className="flex justify-end gap-2">
                  <Button href={`/admin/voitures/${c.id}/modifier`} variant="outline" size="sm" aria-label={`Modifier ${c.marque} ${c.modele}`}>
                    <Pencil className="size-3.5" aria-hidden />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:border-red-300"
                    onClick={() => setToDelete(c)}
                    aria-label={`Supprimer ${c.marque} ${c.modele}`}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Supprimer
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Supprimer cette voiture ?"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-muted">
          {toDelete?.marque} {toDelete?.modele} ({toDelete?.immatriculation}) sera retirée de la flotte. Cette action est définitive.
        </p>
      </Modal>
    </div>
  );
}
