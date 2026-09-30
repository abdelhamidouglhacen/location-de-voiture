"use client";

import { useSyncExternalStore } from "react";
import { cars as seedCars } from "@/lib/data/cars";
import type { Car } from "@/types";

/** Admin fleet edits live in this browser's localStorage; the public site still reads the static seed. */
const KEY = "hg-admin-voitures";
const EVENT = "hg-admin-voitures-change";

let cache: { raw: string | null; list: Car[] } = { raw: null, list: seedCars };

function read(): Car[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return seedCars;
  }
  if (raw === cache.raw) return cache.list;
  let list = seedCars;
  try {
    if (raw) list = JSON.parse(raw) as Car[];
  } catch {
    list = seedCars;
  }
  cache = { raw, list };
  return list;
}

function write(list: Car[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage blocked or full (large uploaded photos): the change is not kept.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useAdminCars(): Car[] {
  return useSyncExternalStore(subscribe, read, () => seedCars);
}

export function slugForCar(marque: string, modele: string) {
  const base =
    `${marque}-${modele}`
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "voiture";
  const taken = new Set(read().map((c) => c.id));
  let id = base;
  for (let i = 2; taken.has(id); i++) id = `${base}-${i}`;
  return id;
}

export function saveCar(car: Car) {
  const list = read();
  const exists = list.some((c) => c.id === car.id);
  write(exists ? list.map((c) => (c.id === car.id ? car : c)) : [car, ...list]);
}

export function deleteCar(id: string) {
  write(read().filter((c) => c.id !== id));
}
