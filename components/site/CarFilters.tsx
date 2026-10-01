"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CATEGORIES } from "@/lib/constants";

export interface Filters {
  categories: string[];
  prixMin: string;
  prixMax: string;
  boite: string;
  carburant: string;
  places: string;
  marque: string;
}

export const emptyFilters: Filters = { categories: [], prixMin: "", prixMax: "", boite: "", carburant: "", places: "", marque: "" };

interface Props {
  value: Filters;
  onChange: (value: Filters) => void;
  marques: string[];
  idPrefix: string;
}

export function CarFilters({ value, onChange, marques, idPrefix }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });
  const toggleCategory = (c: string) =>
    set({ categories: value.categories.includes(c) ? value.categories.filter((x) => x !== c) : [...value.categories, c] });

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold">Category</legend>
        <div className="mt-3 space-y-2.5">
          {CATEGORIES.map((c) => (
            <Checkbox key={c} id={`${idPrefix}-cat-${c}`} label={c} checked={value.categories.includes(c)} onChange={() => toggleCategory(c)} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">Price per day (MAD)</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Input id={`${idPrefix}-prix-min`} label="Min" type="number" inputMode="numeric" min={0} step={50} placeholder="250" value={value.prixMin} onChange={(e) => set({ prixMin: e.target.value })} />
          <Input id={`${idPrefix}-prix-max`} label="Max" type="number" inputMode="numeric" min={0} step={50} placeholder="1500" value={value.prixMax} onChange={(e) => set({ prixMax: e.target.value })} />
        </div>
      </fieldset>

      <Select
        id={`${idPrefix}-boite`}
        label="Gearbox"
        placeholder="All"
        options={[{ value: "Manual", label: "Manual" }, { value: "Automatic", label: "Automatic" }]}
        value={value.boite}
        onChange={(e) => set({ boite: e.target.value })}
      />
      <Select
        id={`${idPrefix}-carburant`}
        label="Fuel"
        placeholder="All"
        options={["Petrol", "Diesel", "Hybrid"].map((c) => ({ value: c, label: c }))}
        value={value.carburant}
        onChange={(e) => set({ carburant: e.target.value })}
      />
      <Select
        id={`${idPrefix}-places`}
        label="Seats"
        placeholder="Any"
        options={[{ value: "5", label: "5 seats or more" }, { value: "7", label: "7 seats or more" }, { value: "9", label: "9 seats" }]}
        value={value.places}
        onChange={(e) => set({ places: e.target.value })}
      />
      <Select
        id={`${idPrefix}-marque`}
        label="Brand"
        placeholder="All"
        options={marques.map((m) => ({ value: m, label: m }))}
        value={value.marque}
        onChange={(e) => set({ marque: e.target.value })}
      />
    </div>
  );
}

export function activeFilterCount(f: Filters) {
  return f.categories.length + [f.prixMin, f.prixMax, f.boite, f.carburant, f.places, f.marque].filter(Boolean).length;
}
