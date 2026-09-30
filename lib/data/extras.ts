import type { Extra } from "@/types";

export const extras: Extra[] = [
  { id: "gps", nom: "GPS", description: "Navigation avec cartes du Maroc à jour.", prix: 30, unite: "jour" },
  { id: "siege-bebe", nom: "Siège bébé", description: "Siège homologué pour enfant de 0 à 4 ans.", prix: 40, unite: "jour" },
  { id: "conducteur", nom: "Conducteur supplémentaire", description: "Un deuxième conducteur assuré au volant.", prix: 50, unite: "jour" },
  { id: "assurance", nom: "Assurance tous risques", description: "Franchise réduite en cas de dommages.", prix: 100, unite: "jour" },
  { id: "livraison-aeroport", nom: "Livraison aéroport", description: "Voiture remise en main propre à l'aéroport Al Massira.", prix: 150, unite: "forfait" },
];
