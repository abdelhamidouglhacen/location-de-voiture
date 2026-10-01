import type { Metadata } from "next";
import { FadeUp } from "@/components/animations/FadeUp";
import { PageHeader } from "@/components/site/PageHeader";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conditions de location",
  description: "Conditions générales de location AZUR DRIVE : âge minimum, permis, caution, carburant, annulation et assurance.",
};

const sections = [
  {
    title: "Conducteur",
    items: [
      "Le conducteur doit avoir au moins 21 ans et un permis de conduire valide depuis au moins 2 ans.",
      "Une pièce d'identité (CIN pour les résidents, passeport pour les visiteurs) est demandée au départ.",
      "Un conducteur supplémentaire peut être ajouté pour 50 MAD par jour. Il doit remplir les mêmes conditions.",
    ],
  },
  {
    title: "Caution",
    items: [
      "Une caution est demandée au départ, en espèces ou par carte bancaire. Son montant dépend de la catégorie : de 3 000 MAD (économique) à 15 000 MAD (luxe).",
      "La caution est rendue au retour si la voiture est rendue dans le même état, avec le plein et à l'heure prévue.",
    ],
  },
  {
    title: "Durée et prix",
    items: [
      "La location est comptée par tranche de 24 heures à partir de l'heure de départ. Un retard de plus de 2 heures compte comme un jour supplémentaire.",
      "Le kilométrage est illimité. Les prix comprennent l'assurance de base et l'assistance 24h/24.",
      "Un tarif dégressif s'applique automatiquement dès 7 jours, puis dès 30 jours de location.",
    ],
  },
  {
    title: "Carburant",
    items: ["La voiture est remise avec le plein et doit être rendue avec le plein. À défaut, le carburant manquant est facturé au prix de la station plus 50 MAD de service."],
  },
  {
    title: "Assurance et dommages",
    items: [
      "L'assurance de base couvre la responsabilité civile. Une franchise reste à la charge du client en cas de dommage.",
      "L'option assurance tous risques (100 MAD par jour) réduit fortement la franchise.",
      "Tout accident doit être déclaré immédiatement à l'agence et faire l'objet d'un constat.",
    ],
  },
  {
    title: "Annulation",
    items: [
      "L'annulation est gratuite jusqu'à 48h avant le départ.",
      "Moins de 48h avant le départ, un jour de location est retenu.",
      "Si le client ne se présente pas, la réservation est facturée une journée.",
    ],
  },
  {
    title: "Utilisation du véhicule",
    items: [
      "La voiture ne peut pas quitter le territoire marocain ni être prise sur un ferry.",
      "Il est interdit de fumer dans la voiture, de la sous-louer ou de l'utiliser pour des courses ou du transport rémunéré.",
      "La conduite sur piste est autorisée uniquement pour les SUV, avec prudence.",
    ],
  },
];

export default function ConditionsPage() {
  return (
    <>
      <PageHeader title="Conditions de location" text="Tout ce qu'il faut savoir avant de prendre la route." crumbs={[{ label: "Conditions" }]} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[240px_1fr] lg:py-20">
        <nav aria-label="Sommaire" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-line">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#section-${i}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-muted hover:border-ink hover:text-ink">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="max-w-3xl space-y-6">
          {sections.map((s, i) => (
            <FadeUp key={s.title}>
              <section id={`section-${i}`} className="scroll-mt-28 rounded-[20px] border border-line bg-surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold tracking-tight">{s.title}</h2>
                <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
                  {s.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-deep" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </FadeUp>
          ))}
          <p className="text-sm text-muted">
            Une question sur ces conditions ? Appelez le {BUSINESS.phones[0].label} ou écrivez à {BUSINESS.email}.
          </p>
        </div>
      </div>
    </>
  );
}
