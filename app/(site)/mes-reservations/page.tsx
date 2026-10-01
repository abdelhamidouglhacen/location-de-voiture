import type { Metadata } from "next";
import { MyReservations } from "@/components/site/MyReservations";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "My bookings",
  description: "Find the cars you booked with AZUR DRIVE, with their dates and estimated price.",
  robots: { index: false },
};

export default function MyReservationsPage() {
  return (
    <>
      <PageHeader title="My bookings" text="The cars you requested, their dates and the estimated price." crumbs={[{ label: "My bookings" }]} />
      <MyReservations />
    </>
  );
}
