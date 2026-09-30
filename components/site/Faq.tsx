import { StaggerGroup } from "@/components/animations/StaggerGroup";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "./SectionHeading";

const questions = [
  { question: "Quels documents faut-il pour louer une voiture ?", answer: "Un permis de conduire valide depuis au moins 2 ans, une pièce d'identité (CIN ou passeport) et la caution. Le conducteur doit avoir au moins 21 ans." },
  { question: "Pouvez-vous livrer la voiture à l'aéroport ou à l'hôtel ?", answer: "Oui. Nous livrons à l'aéroport Agadir Al Massira (150 MAD) et à votre hôtel à Agadir ou Taghazout, à toute heure du jour et de la nuit." },
  { question: "Comment fonctionne la caution ?", answer: "La caution est bloquée au départ, en espèces ou par carte, puis rendue au retour du véhicule s'il est rendu dans le même état. Son montant dépend de la catégorie." },
  { question: "Le kilométrage est-il limité ?", answer: "Non, toutes nos locations sont en kilométrage illimité. La voiture est remise avec le plein et doit être rendue avec le plein." },
  { question: "Puis-je annuler ma réservation ?", answer: "L'annulation est gratuite jusqu'à 48h avant le départ. Au-delà, un jour de location est retenu." },
];

export function Faq() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="faq-titre">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading id="faq-titre" title="Questions fréquentes" text="Tout ce qu'il faut savoir avant de prendre la route. Une autre question ? Appelez-nous, on répond 24h/24." />
        <StaggerGroup selector="[data-stagger-item]">
          <Accordion items={questions} />
        </StaggerGroup>
      </div>
    </section>
  );
}
