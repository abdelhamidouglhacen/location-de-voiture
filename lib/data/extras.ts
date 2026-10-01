import type { Extra } from "@/types";

export const extras: Extra[] = [
  { id: "gps", nom: "GPS", description: "Navigation with up-to-date maps of Morocco.", prix: 30, unite: "jour" },
  { id: "siege-bebe", nom: "Baby seat", description: "Approved seat for children aged 0 to 4.", prix: 40, unite: "jour" },
  { id: "conducteur", nom: "Additional driver", description: "A second insured driver at the wheel.", prix: 50, unite: "jour" },
  { id: "assurance", nom: "Full insurance", description: "Reduced excess in case of damage.", prix: 100, unite: "jour" },
  { id: "livraison-aeroport", nom: "Airport delivery", description: "Car handed over in person at Al Massira airport.", prix: 150, unite: "forfait" },
];
