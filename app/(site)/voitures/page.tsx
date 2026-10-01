import type { Metadata } from "next";
import { Suspense } from "react";
import { CarCatalog } from "@/components/site/CarCatalog";
import { PageHeader } from "@/components/site/PageHeader";
import { cars } from "@/lib/data/cars";

export const metadata: Metadata = {
  title: "Our cars",
  description: "The full AZUR DRIVE fleet in Agadir: economy cars, city cars, SUVs, luxury cars and vans, from 250 MAD per day.",
};

export default function CarsPage() {
  return (
    <>
      <PageHeader title="Our cars" text="Choose a car, then your dates. Air conditioning and unlimited mileage on every car." crumbs={[{ label: "Our cars" }]} />
      <Suspense>
        <CarCatalog cars={cars} />
      </Suspense>
    </>
  );
}
