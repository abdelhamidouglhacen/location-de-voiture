import type { Metadata } from "next";
import { ReservationEntry } from "@/components/booking/ReservationEntry";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { cars } from "@/lib/data/cars";
import { extras } from "@/lib/data/extras";
import { locations } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Booking",
  description: "Send your car rental request to AZUR DRIVE, Agadir.",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ voiture?: string; depart?: string; retour?: string; lieuDepart?: string; lieuRetour?: string }>;
}

export default async function ReservationPage({ searchParams }: Props) {
  const { voiture, depart, retour, lieuDepart, lieuRetour } = await searchParams;
  const car = cars.find((c) => c.id === voiture && c.statut !== "In maintenance");

  return (
    <>
      <PageHeader
        title="Your request"
        text={car ? `${car.marque} ${car.modele}. Fill in your details and we will call you back to confirm.` : undefined}
        crumbs={[{ href: "/voitures", label: "Our cars" }, { label: "Booking" }]}
      />
      {car ? (
        <ReservationEntry car={car} depart={depart} retour={retour} lieuDepart={lieuDepart} lieuRetour={lieuRetour} extras={extras} locations={locations} />
      ) : (
        <div className="mx-auto max-w-xl px-4 py-16">
          <EmptyState title="Choose a car first" text="Browse the fleet and click “Book” on the car you like." action={<Button href="/voitures">See our cars</Button>} />
        </div>
      )}
    </>
  );
}
