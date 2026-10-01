import type { Metadata } from "next";
import { MyReservations } from "@/components/site/MyReservations";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Mes réservations",
  description: "Retrouvez les voitures que vous avez réservées chez AZUR DRIVE, avec leurs dates et le prix estimé.",
  robots: { index: false },
};

export default function MyReservationsPage() {
  return (
    <>
      <PageHeader title="Mes réservations" text="Les voitures que vous avez demandées, leurs dates et le prix estimé." crumbs={[{ label: "Mes réservations" }]} />
      <MyReservations />
    </>
  );
}
