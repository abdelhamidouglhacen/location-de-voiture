"use client";
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { CarFront, Pencil, Plus, Trash2, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import type { Car } from "@/types";

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rented: "bg-blue-50 text-blue-700 border-blue-200",
  "In maintenance": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [toDelete, setToDelete] = useState<Car | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const toasted = useRef(false);

  useEffect(() => {
    // fix toast
    const success = searchParams.get("success");
    if (success && !toasted.current) {
      toasted.current = true;
      toast.success(success);
      router.replace("/admin/voitures");
    }

    // fetch data
    const fetchCars = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("Car")
        .select("*")
        .order("created_at", { ascending: false });
      setCars(data ?? []);
      setLoading(false);
    };
    fetchCars();
  }, []);

  const confirmDelete = async () => {
    const { error } = await supabase.from('Car').delete().eq('id', toDelete?.id)

    if(error){
      toast.error('Failed to delete Car')
    }
    setCars((prev) => prev.filter((car) => car.id !== toDelete?.id))
    toast.error('Car deleted')
    setToDelete(null)
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
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

            {/* cars data */}
            <tbody className="divide-y divide-line">
              {loading ? (
                // skeleton rows while loading
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-12 w-18 shrink-0 animate-pulse rounded-lg bg-sand" />
                        <span className="space-y-2">
                          <span className="block h-3.5 w-32 animate-pulse rounded bg-sand" />
                          <span className="block h-3 w-20 animate-pulse rounded bg-sand" />
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="block h-3.5 w-20 animate-pulse rounded bg-sand" />
                    </td>
                    <td className="px-5 py-3">
                      <span className="block h-3.5 w-16 animate-pulse rounded bg-sand" />
                    </td>
                    <td className="px-5 py-3">
                      <span className="block h-3.5 w-16 animate-pulse rounded bg-sand" />
                    </td>
                    <td className="px-5 py-3">
                      <span className="block h-5 w-20 animate-pulse rounded-full bg-sand" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <span className="h-9 w-16 animate-pulse rounded-full bg-sand" />
                        <span className="h-9 w-20 animate-pulse rounded-full bg-sand" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16">
                    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                      <span className="grid size-14 place-items-center rounded-full bg-sand text-muted">
                        <CarFront className="size-6" aria-hidden />
                      </span>
                      <h3 className="mt-4 font-display text-base font-semibold text-ink">
                        No cars here yet
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        Cars you add to the fleet will appear in this list.
                      </p>
                      <Link
                        href="/admin/voitures/nouvelle"
                        className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition hover:bg-ink-2"
                      >
                        <Plus className="size-4" aria-hidden />
                        Add a car
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car.id} className="transition hover:bg-paper">
                    <td className="px-5 py-3">
                      <Link
                        href="#"
                        className="flex items-center gap-3 hover:underline"
                      >
                        <span className="relative h-12 w-18 shrink-0 overflow-hidden rounded-lg bg-sand">
                          {car.images?.[0] && (
                            <Image
                              src={car.images[0]}
                              alt={`${car.brand} ${car.model}`}
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          )}
                        </span>
                        <span>
                          <span className="block font-medium">
                            {car.brand} {car.model}
                          </span>
                          <span className="block text-xs text-muted">
                            {car.category} · {car.year}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 tabular-nums">
                      {car.registration}
                    </td>
                    <td className="px-5 py-3 tabular-nums">{car.mileage} Km</td>
                    <td className="px-5 py-3 tabular-nums">
                      {car.price_per_day} MAD
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {car.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/voitures/${car.id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm font-medium text-ink transition hover:border-ink/40"
                        >
                          <Pencil className="size-3.5" aria-hidden />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(car)}
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
              {toDelete.brand} {toDelete.model} ({toDelete.registration}) will
              be removed from the fleet. This cannot be undone.
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
                onClick={confirmDelete}
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
