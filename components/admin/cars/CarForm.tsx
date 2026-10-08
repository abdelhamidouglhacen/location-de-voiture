"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { uploadImage } from "@/lib/toWeb";

export function CarForm() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    registration: "",
    color: "",
    mileage: "",
    category: "Economy",
    status: "Available",
    gearbox: "Manual",
    fuel_type: "Petrol",
    seats: 0,
    doors: 0,
    air_conditioning: false,
    price_per_day: 0,
    deposit: 0,
    abs: false,
    airbags: false,
    cruise_control: false,
    touchscreen: false,
    reversing_camera: false,
    parking_assist: false,
    built_in_gps: false,
    bluetooth: false,
    panoramic_roof: false,
  });

  const createCar = async (e: React.FormEvent) => {
    setSaving(true);
    try {
      e.preventDefault();

      const lettersOnly = /^[A-Za-zÀ-ÿ\s-]+$/; // letters, spaces, hyphens
      const lettersNumbers = /^[A-Za-z0-9À-ÿ\s-]+$/; // + numbers
      const plate = /^\d{1,5}-[A-Za-z]-\d{1,2}$/; // e.g. 12345-A-33

      const newErrors: string[] = [];

      // input validation
      if (!lettersOnly.test(form.brand.trim()) || form.brand.trim() === "") {
        newErrors.push("Brand: letters only");
        toast.error("Brand: letters only");
      }

      if (!lettersNumbers.test(form.model.trim())) {
        newErrors.push("Model: letters and numbers only");
        toast.error("Model: letters and numbers only");
      }

      if (form.color && !lettersOnly.test(form.color.trim())) {
        newErrors.push("Colour: letters only");
        toast.error("Colour: letters only");
      }

      if (!plate.test(form.registration.trim())) {
        newErrors.push("Plate format: 12345-A-33");
        toast.error("Plate format: 12345-A-33");
      }

      if (!form.year) {
        newErrors.push("Year is required");
        toast.error("Year is required");
      }

      if (!form.mileage) {
        newErrors.push("mileage is required");
        toast.error("mileage is required");
      }

      if (files.length === 0) {
        newErrors.push("Add at least one photo");
        toast.error("Add at least one photo");
      }

      setErrors(newErrors);

      if (newErrors.length > 0) {
        return;
      }

      // upload pics into cloudinary

      // we use Promise to tell array to wait till data comes in
      const urls = await Promise.all(files.map(uploadImage));

      const { status, ...car } = form;

      // insert all data into supabase
      const { error } = await supabase.from("Car").insert({
        // add rest of data
        ...car,
        // add convert into numbers
        year: Number(form.year),
        mileage: Number(form.mileage),
        seats: Number(form.seats),
        doors: Number(form.doors),
        price_per_day: Number(form.price_per_day),
        deposit: Number(form.deposit),
        images: urls,
      });

      if (error) throw new Error(error.message);
      router.push("/admin/voitures?success=Car+Created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form noValidate className="space-y-6">
      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded-[20px] border border-red-200 bg-red-50 p-5"
        >
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 size-5 shrink-0 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <div className="flex-1">
              <h3 className="font-display text-sm font-semibold text-red-800">
                Please fix the following{" "}
                {errors.length > 1 ? "errors" : "error"}:
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              aria-label="Dismiss errors"
              onClick={() => setErrors([])}
              className="grid size-7 place-items-center rounded-full text-red-700 transition hover:bg-red-100"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div className="rounded-[20px] border border-line bg-surface">
        <div className="px-5 pt-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Details
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="brand" className="text-sm font-medium text-ink">
              Brand
              <span className="ml-0.5 text-red-600" aria-hidden>
                *
              </span>
            </label>
            <input
              id="brand"
              name="brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              type="text"
              placeholder="Dacia"
              required
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="model" className="text-sm font-medium text-ink">
              Model
              <span className="ml-0.5 text-red-600" aria-hidden>
                *
              </span>
            </label>
            <input
              id="model"
              name="model"
              type="text"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Duster"
              required
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="year" className="text-sm font-medium text-ink">
              Year
              <span className="ml-0.5 text-red-600" aria-hidden>
                *
              </span>
            </label>
            <input
              id="year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              name="year"
              type="number"
              inputMode="numeric"
              required
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="registration"
              className="text-sm font-medium text-ink"
            >
              Plate number
              <span className="ml-0.5 text-red-600" aria-hidden>
                *
              </span>
            </label>
            <input
              id="registration"
              name="registration"
              value={form.registration}
              onChange={(e) =>
                setForm({ ...form, registration: e.target.value })
              }
              type="text"
              placeholder="12345-A-33"
              required
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="color" className="text-sm font-medium text-ink">
              Colour
            </label>
            <input
              id="color"
              name="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              type="text"
              placeholder="White"
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="mileage" className="text-sm font-medium text-ink">
              Mileage (km)
              <span className="ml-0.5 text-red-600" aria-hidden>
                *
              </span>
            </label>
            <input
              id="mileage"
              name="mileage"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              type="number"
              inputMode="numeric"
              min={0}
              required
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium text-ink">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                name="category"
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-line bg-surface px-4 pr-10 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
              >
                <option value="Economy">Economy</option>
                <option value="City">City</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Van">Van</option>
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm font-medium text-ink">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-line bg-surface px-4 pr-10 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
              >
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="In maintenance">In maintenance</option>
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-line bg-surface">
        <div className="px-5 pt-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Specifications
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="gearbox" className="text-sm font-medium text-ink">
              Gearbox
            </label>
            <div className="relative">
              <select
                id="gearbox"
                value={form.gearbox}
                onChange={(e) => setForm({ ...form, gearbox: e.target.value })}
                name="gearbox"
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-line bg-surface px-4 pr-10 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fuel_type" className="text-sm font-medium text-ink">
              Fuel
            </label>
            <div className="relative">
              <select
                id="fuel_type"
                name="fuel_type"
                value={form.fuel_type}
                onChange={(e) =>
                  setForm({ ...form, fuel_type: e.target.value })
                }
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-line bg-surface px-4 pr-10 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="seats" className="text-sm font-medium text-ink">
              Seats
            </label>
            <input
              id="seats"
              name="seats"
              value={form.seats}
              onChange={(e) =>
                setForm({ ...form, seats: Number(e.target.value) })
              }
              type="number"
              inputMode="numeric"
              min={1}
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="doors" className="text-sm font-medium text-ink">
              Doors
            </label>
            <input
              id="doors"
              name="doors"
              type="number"
              value={form.doors}
              onChange={(e) =>
                setForm({ ...form, doors: Number(e.target.value) })
              }
              inputMode="numeric"
              min={1}
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
          </div>
          <div className="flex items-end pb-3">
            <label
              htmlFor="air_conditioning"
              className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
            >
              <input
                id="air_conditioning"
                name="air_conditioning"
                checked={form.air_conditioning}
                onChange={(e) =>
                  setForm({ ...form, air_conditioning: e.target.checked })
                }
                type="checkbox"
                className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
              />
              <span>Air conditioning</span>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-line bg-surface">
        <div className="px-5 pt-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Pricing
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="price_per_day"
              className="text-sm font-medium text-ink"
            >
              Price per day (MAD)
              <span className="ml-0.5 text-red-600" aria-hidden>
                *
              </span>
            </label>
            <input
              id="price_per_day"
              name="price_per_day"
              value={form.price_per_day}
              onChange={(e) =>
                setForm({ ...form, price_per_day: Number(e.target.value) })
              }
              type="number"
              inputMode="numeric"
              min={1}
              required
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="deposit" className="text-sm font-medium text-ink">
              Deposit (MAD)
            </label>
            <input
              id="deposit"
              name="deposit"
              value={form.deposit}
              onChange={(e) =>
                setForm({ ...form, deposit: Number(e.target.value) })
              }
              type="number"
              inputMode="numeric"
              min={0}
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
            />
            <p className="text-xs text-muted">
              Returned when the vehicle comes back.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-line bg-surface">
        <div className="px-5 pt-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Features
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 p-5">
          {/* <label
            htmlFor="power_windows"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="power_windows"
              name="power_windows"
               checked={form.po}
              onChange={(e) => setForm({ ...form, po: e.target.checked})}
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>Electric windows</span>
          </label> */}
          <label
            htmlFor="touchscreen"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="touchscreen"
              name="touchscreen"
              checked={form.touchscreen}
              onChange={(e) =>
                setForm({ ...form, touchscreen: e.target.checked })
              }
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>Touchscreen</span>
          </label>
          <label
            htmlFor="cruise_control"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="cruise_control"
              name="cruise_control"
              checked={form.cruise_control}
              onChange={(e) =>
                setForm({ ...form, cruise_control: e.target.checked })
              }
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>Cruise control</span>
          </label>
          <label
            htmlFor="bluetooth"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="bluetooth"
              name="bluetooth"
              checked={form.bluetooth}
              onChange={(e) =>
                setForm({ ...form, bluetooth: e.target.checked })
              }
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>Bluetooth</span>
          </label>
          <label
            htmlFor="abs"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="abs"
              name="abs"
              checked={form.abs}
              onChange={(e) => setForm({ ...form, abs: e.target.checked })}
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>ABS</span>
          </label>
          <label
            htmlFor="built_in_gps"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="built_in_gps"
              name="built_in_gps"
              checked={form.built_in_gps}
              onChange={(e) =>
                setForm({ ...form, built_in_gps: e.target.checked })
              }
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>Built-in GPS navigation</span>
          </label>
          <label
            htmlFor="airbags"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="airbags"
              name="airbags"
              checked={form.airbags}
              onChange={(e) => setForm({ ...form, airbags: e.target.checked })}
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>Airbags</span>
          </label>
          <label
            htmlFor="rear_camera"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="rear_camera"
              name="rear_camera"
              checked={form.reversing_camera}
              onChange={(e) =>
                setForm({ ...form, reversing_camera: e.target.checked })
              }
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>Reversing camera</span>
          </label>
          <label
            htmlFor="panoramic_roof"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="panoramic_roof"
              checked={form.panoramic_roof}
              onChange={(e) =>
                setForm({ ...form, panoramic_roof: e.target.checked })
              }
              name="panoramic_roof"
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>Panoramic roof</span>
          </label>
          <label
            htmlFor="parking_assist"
            className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              id="parking_assist"
              checked={form.parking_assist}
              onChange={(e) =>
                setForm({ ...form, parking_assist: e.target.checked })
              }
              name="parking_assist"
              type="checkbox"
              className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
            />
            <span>Parking assist</span>
          </label>
        </div>
      </div>

      <div className="rounded-[20px] border border-line bg-surface">
        <div className="px-5 pt-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Photos
          </h2>
        </div>
        <div className="flex flex-col items-start gap-4 p-5">
          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {preview.map((src, i) => (
              <li
                key={src}
                className="relative aspect-[16/10] overflow-hidden rounded-xl bg-sand"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img src={src} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  aria-label={`Remove photo ${i + 1}`}
                  onClick={() => {
                    setFiles((prev) => prev.filter((_, j) => j !== i));
                    setPreview((prev) => prev.filter((_, j) => j !== i));
                  }}
                  className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-surface/90 text-ink shadow hover:bg-surface"
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-medium transition hover:border-ink/40">
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M16 5h6" />
              <path d="M19 2v6" />
              <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              <circle cx="9" cy="9" r="2" />
            </svg>
            Upload
            <input
              id="images"
              name="images"
              onChange={(e) => {
                const picked = Array.from(e.target.files ?? []);

                // put the picked files(pics) in state of Files to upload them into cloudinary
                setFiles((prev) => [...prev, ...picked]);

                // put the picked files(pics) in state of Preview to upload them into preview state
                setPreview((prev) => [
                  ...prev,
                  ...picked.map((file) => URL.createObjectURL(file)),
                ]);
              }}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          href="/admin/voitures"
          className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink transition hover:border-ink/40"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={createCar}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition hover:bg-ink-2 disabled:opacity-60"
        >
          {saving ? (
            <>
              <svg
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}
