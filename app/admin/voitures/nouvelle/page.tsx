"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CarForm } from "@/components/admin/CarForm";

export default function NewCarPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/voitures" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Cars
      </Link>
      <h2 className="font-display text-3xl font-semibold tracking-[-0.02em]">New car</h2>
      <CarForm />
    </div>
  );
}
