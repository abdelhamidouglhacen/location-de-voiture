"use client";

import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/States";
import { locations } from "@/lib/data/locations";
import { formatDateTime } from "@/lib/format";
import { calculateDays } from "@/lib/price";
import { readSearch, type RentalSearch } from "@/lib/search";
import type { Car } from "@/types";
import { CarCard } from "./CarCard";
import { activeFilterCount, CarFilters, emptyFilters, type Filters } from "./CarFilters";

const SORTS = [
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "recentes", label: "Plus récentes" },
];

function applyFilters(cars: Car[], f: Filters) {
  return cars.filter(
    (c) =>
      (!f.categories.length || f.categories.includes(c.categorie)) &&
      (!f.prixMin || c.prixParJour >= Number(f.prixMin)) &&
      (!f.prixMax || c.prixParJour <= Number(f.prixMax)) &&
      (!f.boite || c.boite === f.boite) &&
      (!f.carburant || c.carburant === f.carburant) &&
      (!f.places || c.places >= Number(f.places)) &&
      (!f.marque || c.marque === f.marque),
  );
}

function sortCars(cars: Car[], sort: string) {
  const sorted = [...cars];
  if (sort === "prix-asc") sorted.sort((a, b) => a.prixParJour - b.prixParJour);
  if (sort === "prix-desc") sorted.sort((a, b) => b.prixParJour - a.prixParJour);
  if (sort === "recentes") sorted.sort((a, b) => b.annee - a.annee);
  return sorted;
}

export function CarCatalog({ cars }: { cars: Car[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const search = useMemo(() => readSearch((key) => params.get(key)), [params]);
  const [filters, setFilters] = useState<Filters>(() => ({ ...emptyFilters, categories: params.getAll("categorie") }));
  const [sort, setSort] = useState("prix-asc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const marques = useMemo(() => [...new Set(cars.map((c) => c.marque))].sort(), [cars]);
  // With searched dates, cars in maintenance can't be booked, so they are hidden.
  const bookable = useMemo(() => (search ? cars.filter((c) => c.statut !== "En maintenance") : cars), [cars, search]);
  const results = useMemo(() => sortCars(applyFilters(bookable, filters), sort), [bookable, filters, sort]);
  const count = activeFilterCount(filters);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:py-16">
      <aside className="hidden lg:block" aria-label="Filtres">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pr-3 pb-6 [scrollbar-width:thin]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Filtres</h2>
            {count > 0 && (
              <button type="button" onClick={() => setFilters(emptyFilters)} className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
                <X className="size-3.5" aria-hidden />
                Effacer
              </button>
            )}
          </div>
          <CarFilters value={filters} onChange={setFilters} marques={marques} idPrefix="desktop" />
        </div>
      </aside>

      <div>
        {search && <SearchSummary search={search} onClear={() => router.replace("/voitures", { scroll: false })} />}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <p className="text-[15px] text-muted" aria-live="polite">
            <strong className="font-semibold text-ink">{results.length}</strong> voiture{results.length > 1 ? "s" : ""}
          </p>
          <div className="flex items-end gap-3">
            <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtres{count > 0 && ` (${count})`}
            </Button>
            <Select id="tri" label="Trier par" options={SORTS} value={sort} onChange={(e) => setSort(e.target.value)} wrapperClassName="w-48" />
          </div>
        </div>

        <div className="mt-8">
          {results.length === 0 ? (
            <div className="rounded-[20px] border border-line bg-surface">
              <EmptyState
                title="Aucune voiture ne correspond"
                text="Élargissez votre budget ou retirez quelques filtres. Vous pouvez aussi nous appeler."
                action={<Button onClick={() => setFilters(emptyFilters)}>Effacer les filtres</Button>}
              />
            </div>
          ) : (
            <StaggerGroup key={`${sort}-${results.length}`} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((car, i) => (
                <CarCard key={car.id} car={car} priority={i < 3} search={search} />
              ))}
            </StaggerGroup>
          )}
        </div>
      </div>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtres"
        footer={
          <>
            <Button variant="outline" onClick={() => setFilters(emptyFilters)}>
              Effacer
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>Voir {results.length} voitures</Button>
          </>
        }
      >
        <CarFilters value={filters} onChange={setFilters} marques={marques} idPrefix="mobile" />
      </Modal>
    </div>
  );
}

const placeName = (id?: string) => locations.find((l) => l.id === id)?.nom ?? locations[0].nom;

function SearchSummary({ search, onClear }: { search: RentalSearch; onClear: () => void }) {
  const days = calculateDays(search.depart, search.retour);
  return (
    <section aria-label="Votre recherche" className="mb-8 rounded-[20px] border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">Départ</p>
          <p className="font-medium tabular-nums">{formatDateTime(search.depart)}</p>
          <p className="truncate text-sm text-muted">{placeName(search.lieuDepart)}</p>
        </div>
        <ArrowRight className="hidden size-4 shrink-0 text-accent-deep sm:block" aria-hidden />
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">Destination</p>
          <p className="font-medium tabular-nums">{formatDateTime(search.retour)}</p>
          <p className="truncate text-sm text-muted">{placeName(search.lieuRetour)}</p>
        </div>
        <p className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent-deep tabular-nums">
          {days} jour{days > 1 ? "s" : ""}
        </p>
        <div className="ml-auto flex gap-2">
          <Link href="/#recherche" className="inline-flex h-9 items-center rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40">
            Modifier
          </Link>
          <button type="button" onClick={onClear} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted hover:text-ink">
            <X className="size-3.5" aria-hidden />
            Effacer
          </button>
        </div>
      </div>
    </section>
  );
}
