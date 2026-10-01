"use client";

import { ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { saveCar, slugForCar } from "@/lib/adminCars";
import type { Boite, Car, Carburant, Categorie, StatutVoiture } from "@/types";

const CATEGORIES: Categorie[] = ["Economy", "City", "SUV", "Luxury", "Van"];
const BOITES: Boite[] = ["Manual", "Automatic"];
const CARBURANTS: Carburant[] = ["Petrol", "Diesel", "Hybrid"];
const STATUTS: StatutVoiture[] = ["Available", "Rented", "In maintenance"];
const EQUIPEMENTS = [
  "Air conditioning",
  "Bluetooth",
  "Power steering",
  "Electric windows",
  "ABS",
  "Airbags",
  "Touchscreen",
  "Apple CarPlay / Android Auto",
  "Reversing camera",
  "Cruise control",
  "Leather seats",
  "Panoramic roof",
  "Heated seats",
  "Built-in GPS navigation",
  "Parking assist",
];
const MAX_PHOTO_BYTES = 1_500_000;

const opts = (list: readonly string[]) => list.map((v) => ({ value: v, label: v }));

interface Values {
  marque: string;
  modele: string;
  annee: string;
  categorie: Categorie;
  boite: Boite;
  carburant: Carburant;
  places: string;
  portes: string;
  bagages: string;
  prixParJour: string;
  caution: string;
  immatriculation: string;
  couleur: string;
  kilometrage: string;
  statut: StatutVoiture;
  climatisation: boolean;
  equipements: string[];
  images: string[];
}

function toValues(car?: Car): Values {
  return {
    marque: car?.marque ?? "",
    modele: car?.modele ?? "",
    annee: String(car?.annee ?? new Date().getFullYear()),
    categorie: car?.categorie ?? "City",
    boite: car?.boite ?? "Manual",
    carburant: car?.carburant ?? "Petrol",
    places: String(car?.places ?? 5),
    portes: String(car?.portes ?? 5),
    bagages: String(car?.bagages ?? 2),
    prixParJour: car ? String(car.prixParJour) : "",
    caution: car ? String(car.caution) : "",
    immatriculation: car?.immatriculation ?? "",
    couleur: car?.couleur ?? "",
    kilometrage: car ? String(car.kilometrage) : "",
    statut: car?.statut ?? "Available",
    climatisation: car?.climatisation ?? true,
    equipements: car?.equipements ?? ["Air conditioning", "Bluetooth", "ABS", "Airbags"],
    images: car?.images ?? [],
  };
}

type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  const year = new Date().getFullYear() + 1;
  if (!v.marque.trim()) e.marque = "Enter the brand.";
  if (!v.modele.trim()) e.modele = "Enter the model.";
  if (!v.immatriculation.trim()) e.immatriculation = "Enter the plate number.";
  const annee = Number(v.annee);
  if (!Number.isInteger(annee) || annee < 1990 || annee > year) e.annee = `Between 1990 and ${year}.`;
  if (!(Number(v.prixParJour) > 0)) e.prixParJour = "Price must be above 0.";
  if (v.caution !== "" && !(Number(v.caution) >= 0)) e.caution = "Invalid amount.";
  if (v.kilometrage === "" || !(Number(v.kilometrage) >= 0)) e.kilometrage = "Invalid mileage.";
  for (const k of ["places", "portes", "bagages"] as const) {
    const n = Number(v[k]);
    if (!Number.isInteger(n) || n < (k === "bagages" ? 0 : 1) || n > 20) e[k] = "Invalid value.";
  }
  if (v.images.length === 0) e.images = "Add at least one photo.";
  return e;
}

export function CarForm({ car }: { car?: Car }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<Values>(() => toValues(car));
  const [errors, setErrors] = useState<Errors>({});
  const [photoUrl, setPhotoUrl] = useState("");

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const field = (key: keyof Values) => ({
    name: key,
    value: values[key] as string,
    error: errors[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(key, e.target.value as never),
  });

  const addPhotos = (urls: string[]) => set("images", [...values.images, ...urls]);

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const picked = Array.from(files);
    if (picked.some((f) => f.size > MAX_PHOTO_BYTES)) {
      toast("Photo too large (1.5 MB maximum).", "error");
      return;
    }
    const urls = await Promise.all(
      picked.map(
        (f) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(f);
          }),
      ),
    );
    addPhotos(urls);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      toast("Fix the fields in red.", "error");
      return;
    }
    const prixParJour = Number(values.prixParJour);
    const next: Car = {
      id: car?.id ?? slugForCar(values.marque, values.modele),
      marque: values.marque.trim(),
      modele: values.modele.trim(),
      annee: Number(values.annee),
      categorie: values.categorie,
      boite: values.boite,
      carburant: values.carburant,
      places: Number(values.places),
      portes: Number(values.portes),
      bagages: Number(values.bagages),
      climatisation: values.climatisation,
      prixParJour,
      prixParSemaine: prixParJour * 6,
      prixParMois: prixParJour * 22,
      caution: values.caution === "" ? 0 : Number(values.caution),
      images: values.images,
      equipements: values.equipements,
      statut: values.statut,
      immatriculation: values.immatriculation.trim(),
      couleur: values.couleur.trim(),
      kilometrage: Number(values.kilometrage),
      maintenance: car?.maintenance ?? [],
      ajouteLe: car?.ajouteLe ?? new Date().toISOString(),
    };
    saveCar(next);
    toast(car ? "Car updated." : "Car added.");
    router.push("/admin/voitures");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Brand" required placeholder="Dacia" {...field("marque")} />
          <Input label="Model" required placeholder="Duster" {...field("modele")} />
          <Input label="Year" required type="number" inputMode="numeric" {...field("annee")} />
          <Input label="Plate number" required placeholder="12345-A-33" {...field("immatriculation")} />
          <Input label="Colour" placeholder="White" {...field("couleur")} />
          <Input label="Mileage (km)" required type="number" inputMode="numeric" min={0} {...field("kilometrage")} />
          <Select label="Category" options={opts(CATEGORIES)} {...field("categorie")} />
          <Select label="Status" options={opts(STATUTS)} {...field("statut")} />
        </div>
      </Card>

      <Card title="Specifications">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Gearbox" options={opts(BOITES)} {...field("boite")} />
          <Select label="Fuel" options={opts(CARBURANTS)} {...field("carburant")} />
          <Input label="Seats" type="number" inputMode="numeric" min={1} {...field("places")} />
          <Input label="Doors" type="number" inputMode="numeric" min={1} {...field("portes")} />
          <Input label="Luggage" type="number" inputMode="numeric" min={0} {...field("bagages")} />
          <div className="flex items-end pb-3">
            <Checkbox name="climatisation" label="Air conditioning" checked={values.climatisation} onChange={(e) => set("climatisation", e.target.checked)} />
          </div>
        </div>
      </Card>

      <Card title="Pricing">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Price per day (MAD)" required type="number" inputMode="numeric" min={1} {...field("prixParJour")} />
          <Input label="Deposit (MAD)" type="number" inputMode="numeric" min={0} hint="Returned when the vehicle comes back." {...field("caution")} />
        </div>
      </Card>

      <Card title="Features">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPEMENTS.map((eq, i) => (
            <Checkbox
              key={eq}
              id={`eq-${i}`}
              label={eq}
              checked={values.equipements.includes(eq)}
              onChange={(e) => set("equipements", e.target.checked ? [...values.equipements, eq] : values.equipements.filter((x) => x !== eq))}
            />
          ))}
        </div>
      </Card>

      <Card title="Photos">
        <div className="space-y-4">
          {values.images.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {values.images.map((src, i) => (
                <li key={`${i}-${src.slice(0, 40)}`} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element -- previews may be data URLs */}
                  <img src={src} alt="" className="size-full object-cover" />
                  {i === 0 && <span className="absolute bottom-2 left-2 rounded-full bg-ink/80 px-2 py-0.5 text-xs text-white">Main</span>}
                  <button
                    type="button"
                    onClick={() => set("images", values.images.filter((_, j) => j !== i))}
                    className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-surface/90 text-ink shadow hover:bg-surface"
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              label="Add by link"
              name="photoUrl"
              placeholder="/cars/dacia-duster-1.jpg or https://…"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              wrapperClassName="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => {
                if (!photoUrl.trim()) return;
                addPhotos([photoUrl.trim()]);
                setPhotoUrl("");
              }}
            >
              Add
            </Button>
            <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-medium transition hover:border-ink/40">
              <ImagePlus className="size-4" aria-hidden />
              Upload
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
            </label>
          </div>
          {errors.images && (
            <p className="text-sm text-red-600" role="alert">
              {errors.images}
            </p>
          )}
        </div>
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <Button href="/admin/voitures" variant="outline">
          Cancel
        </Button>
        <Button type="submit">{car ? "Save" : "Add car"}</Button>
      </div>
    </form>
  );
}
