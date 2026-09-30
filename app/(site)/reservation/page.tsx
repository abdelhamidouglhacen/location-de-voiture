import type { Metadata } from "next";
import { ReservationEntry } from "@/components/booking/ReservationEntry";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { cars } from "@/lib/data/cars";
import { extras } from "@/lib/data/extras";
import { locations } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Réservation",
  description: "Envoyez votre demande de location de voiture à HG SELF DRIVE, Agadir.",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ voiture?: string; depart?: string; retour?: string; lieuDepart?: string; lieuRetour?: string }>;
}

export default async function ReservationPage({ searchParams }: Props) {
  const { voiture, depart, retour, lieuDepart, lieuRetour } = await searchParams;
  const car = cars.find((c) => c.id === voiture && c.statut !== "En maintenance");

  return (
    <>
      <PageHeader
        title="Votre demande"
        text={car ? `${car.marque} ${car.modele}. Complétez vos informations, nous vous rappelons pour confirmer.` : undefined}
        crumbs={[{ href: "/voitures", label: "Nos voitures" }, { label: "Réservation" }]}
      />
      {car ? (
        <ReservationEntry car={car} depart={depart} retour={retour} lieuDepart={lieuDepart} lieuRetour={lieuRetour} extras={extras} locations={locations} />
      ) : (
        <div className="mx-auto max-w-xl px-4 py-16">
          <EmptyState title="Choisissez d'abord une voiture" text="Parcourez la flotte et cliquez sur « Réserver » sur la voiture qui vous plaît." action={<Button href="/voitures">Voir nos voitures</Button>} />
        </div>
      )}
    </>
  );
}
