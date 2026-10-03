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
  if (!car) return <EmptyState title="Car not found" text="This car does not exist." action={<Button href="/admin/voitures">Back to cars</Button>} />;

  return (
    <div className="space-y-6">
      <Link href={`/admin/voitures/${car.id}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        {car.marque} {car.modele}
      </Link>
      <h2 className="font-display text-3xl font-semibold tracking-[-0.02em]">Edit car</h2>
      <CarForm />
    </div>
  );
}
