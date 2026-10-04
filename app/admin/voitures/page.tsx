"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteCar, useAdminCars } from "@/lib/adminCars";
import { formatMAD, formatNumber } from "@/lib/format";
import type { Car } from "@/types";

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rented: "bg-blue-50 text-blue-700 border-blue-200",
  "In maintenance": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AdminCarsPage() {
  const list = useAdminCars();

  const [toDelete, setToDelete] = useState<Car | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Filter by status"
          className="inline-flex flex-wrap gap-1 rounded-full bg-sand p-1"
        >
          {/* active tab */}
          <button
            type="button"
            role="tab"
            aria-selected="true"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-ink shadow-sm"
          >
            All
            <span className="rounded-full bg-sand px-2 py-0.5 text-xs tabular-nums text-ink">
              20
            </span>
          </button>

          {/* inactive tabs */}
          <button
            type="button"
            role="tab"
            aria-selected="false"
            className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted transition hover:text-ink"
          >
            Available
            <span className="rounded-full bg-line px-2 py-0.5 text-xs tabular-nums text-muted">
              15
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected="false"
            className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted transition hover:text-ink"
          >
            Rented
            <span className="rounded-full bg-line px-2 py-0.5 text-xs tabular-nums text-muted">
              4
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected="false"
            className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted transition hover:text-ink"
          >
            In maintenance
            <span className="rounded-full bg-line px-2 py-0.5 text-xs tabular-nums text-muted">
              1
            </span>
          </button>
        </div>

        {/* Add button */}
        <Link
          href="/admin/voitures/nouvelle"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition hover:bg-ink-2"
        >
          <Plus className="size-4" aria-hidden />
          Add a car
        </Link>
      </div>

      {/* Card + Table */}
      <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Car list</caption>
            <thead className="border-b border-line text-xs text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Car</th>
                <th className="px-5 py-3 font-medium">Plate</th>
                <th className="px-5 py-3 font-medium">Mileage</th>
                <th className="px-5 py-3 font-medium">Price / day</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.length === 0 ? (
                <tr>
                  {/* Empty state */}
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="font-medium text-ink">No cars</p>
                    <p className="mt-1 text-muted">
                      No cars match this filter.
                    </p>
                  </td>
                </tr>
              ) : (
                list.map((c) => (
                  <tr key={c.id}>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/voitures/${c.id}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <span className="relative h-12 w-18 shrink-0 overflow-hidden rounded-lg bg-sand">
                          {c.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element -- admin photos may be data URLs or external links
                            <img
                              src={c.images[0]}
                              alt=""
                              className="size-full object-cover"
                            />
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
                    </td>
                    <td className="px-5 py-3 tabular-nums">
                      {c.immatriculation}
                    </td>
                    <td className="px-5 py-3 tabular-nums">
                      {formatNumber(c.kilometrage)} km
                    </td>
                    <td className="px-5 py-3 tabular-nums">
                      {formatMAD(c.prixParJour)}
                    </td>
                    <td className="px-5 py-3">
                      {/* Status badge */}
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          statusStyles[c.statut] ??
                          "bg-sand text-muted border-line"
                        }`}
                      >
                        {c.statut}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/voitures/${c.id}/modifier`}
                          aria-label={`Edit ${c.marque} ${c.modele}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm font-medium text-ink transition hover:border-ink/40"
                        >
                          <Pencil className="size-3.5" aria-hidden />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(c)}
                          aria-label={`Delete ${c.marque} ${c.modele}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm font-medium text-red-600 transition hover:border-red-300"
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setToDelete(null)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="relative w-full max-w-sm rounded-[20px] bg-surface p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="delete-title"
                className="font-display text-lg font-semibold tracking-tight"
              >
                Delete this car?
              </h2>
              <button
                type="button"
                onClick={() => setToDelete(null)}
                aria-label="Close"
                className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-sand hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <p className="mt-3 text-[15px] text-muted">
              {toDelete.marque} {toDelete.modele} ({toDelete.immatriculation})
              will be removed from the fleet. This cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setToDelete(null)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-ink transition hover:border-ink/40"
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
