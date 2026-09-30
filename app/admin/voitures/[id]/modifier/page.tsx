"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CarForm } from "@/components/admin/CarForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { useAdminCars } from "@/lib/adminCars";

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const car = useAdminCars().find((c) => c.id === id);
  if (!car) return <EmptyState title="Voiture introuvable" text="Cette voiture n'existe pas." action={<Button href="/admin/voitures">Retour aux voitures</Button>} />;

  return (
    <div className="space-y-6">
      <Link href={`/admin/voitures/${car.id}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        {car.marque} {car.modele}
      </Link>
      <h2 className="font-display text-3xl font-semibold tracking-[-0.02em]">Modifier la voiture</h2>
      <CarForm key={car.id} car={car} />
    </div>
  );
}
