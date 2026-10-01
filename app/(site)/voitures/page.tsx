import type { Metadata } from "next";
import { Suspense } from "react";
import { CarCatalog } from "@/components/site/CarCatalog";
import { PageHeader } from "@/components/site/PageHeader";
import { cars } from "@/lib/data/cars";

export const metadata: Metadata = {
  title: "Nos voitures",
  description: "Toute la flotte AZUR DRIVE à Agadir : économiques, citadines, SUV, voitures de luxe et vans, dès 250 MAD par jour.",
};

export default function CarsPage() {
  return (
    <>
      <PageHeader title="Nos voitures" text="Choisissez une voiture, puis vos dates. Climatisation et kilométrage illimité partout." crumbs={[{ label: "Nos voitures" }]} />
      <Suspense>
        <CarCatalog cars={cars} />
      </Suspense>
    </>
  );
}
