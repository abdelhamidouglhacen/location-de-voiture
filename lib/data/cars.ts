import type { Car } from "@/types";
import { daysFromNow } from "./dates";

type CarSeed = Omit<Car, "prixParSemaine" | "prixParMois" | "images" | "maintenance" | "ajouteLe" | "caution"> & {
  photos: string[];
  caution?: number;
  ajouteIlYa: number;
};

const EQUIP_BASE = ["Climatisation", "Bluetooth", "Direction assistée", "Vitres électriques", "ABS", "Airbags"];
const EQUIP_PLUS = [...EQUIP_BASE, "Écran tactile", "Apple CarPlay / Android Auto", "Caméra de recul", "Régulateur de vitesse"];
const EQUIP_LUXE = [...EQUIP_PLUS, "Sièges en cuir", "Toit panoramique", "Sièges chauffants", "Navigation GPS intégrée", "Aide au stationnement"];

const CAUTION: Record<Car["categorie"], number> = {
  Économique: 3000,
  Citadine: 4000,
  SUV: 6000,
  Luxe: 15000,
  Van: 6000,
};

/** Cars whose next service is due within the month, so the dashboard shows maintenance alerts. */
const DUE_SOON = ["vw-t-roc", "dacia-logan"];

function car(seed: CarSeed, index: number): Car {
  const { photos, ajouteIlYa, ...rest } = seed;
  return {
    ...rest,
    caution: seed.caution ?? CAUTION[seed.categorie],
    prixParSemaine: seed.prixParJour * 6,
    prixParMois: seed.prixParJour * 22,
    images: photos.map((p) => `/cars/${p}.jpg`),
    ajouteLe: daysFromNow(-ajouteIlYa),
    // Newest entry first; its "prochainEntretien" drives the dashboard alert.
    maintenance: [
      {
        id: `m-${seed.id}-2`,
        date: daysFromNow(-40 - index),
        type: index % 2 ? "Pneus avant" : "Plaquettes de frein",
        cout: seed.categorie === "Luxe" ? 3800 : 1200,
        kilometrage: seed.kilometrage - 3200,
        prochainEntretien: daysFromNow(DUE_SOON.includes(seed.id) ? 5 + index % 7 : 110 - index),
      },
      {
        id: `m-${seed.id}-1`,
        date: daysFromNow(-120 - index * 3),
        type: "Vidange + filtres",
        cout: seed.categorie === "Luxe" ? 2400 : 850,
        kilometrage: seed.kilometrage - 9000,
        prochainEntretien: daysFromNow(-40 - index),
      },
    ],
  };
}

const seeds: CarSeed[] = [
  { id: "mercedes-gle", marque: "Mercedes", modele: "GLE 350d", annee: 2024, categorie: "Luxe", boite: "Automatique", carburant: "Diesel", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 1500, equipements: EQUIP_LUXE, statut: "Louée", immatriculation: "48215-A-33", couleur: "Blanc", kilometrage: 18400, photos: ["mercedes-gle-1", "mercedes-gle-2", "mercedes-gle-3"], ajouteIlYa: 150 },
  { id: "range-rover-evoque", marque: "Range Rover", modele: "Evoque", annee: 2023, categorie: "Luxe", boite: "Automatique", carburant: "Diesel", places: 5, portes: 5, bagages: 3, climatisation: true, prixParJour: 1300, equipements: EQUIP_LUXE, statut: "Disponible", immatriculation: "51903-A-33", couleur: "Blanc Fuji", kilometrage: 26100, photos: ["range-rover-evoque-1", "range-rover-evoque-2"], ajouteIlYa: 300 },
  { id: "mercedes-classe-c", marque: "Mercedes", modele: "Classe C 200", annee: 2023, categorie: "Luxe", boite: "Automatique", carburant: "Essence", places: 5, portes: 4, bagages: 3, climatisation: true, prixParJour: 1100, equipements: EQUIP_LUXE, statut: "Disponible", immatriculation: "39772-A-33", couleur: "Blanc", kilometrage: 31500, photos: ["mercedes-classe-c-1", "mercedes-classe-c-2", "mercedes-classe-c-3"], ajouteIlYa: 260 },
  { id: "bmw-x1", marque: "BMW", modele: "X1 sDrive18d", annee: 2024, categorie: "Luxe", boite: "Automatique", carburant: "Diesel", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 950, equipements: EQUIP_LUXE, statut: "Disponible", immatriculation: "55310-A-33", couleur: "Vert Cape York", kilometrage: 9800, photos: ["bmw-x1-1", "bmw-x1-2", "bmw-x1-3"], ajouteIlYa: 40 },
  { id: "hyundai-tucson", marque: "Hyundai", modele: "Tucson", annee: 2024, categorie: "SUV", boite: "Automatique", carburant: "Hybride", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 700, equipements: EQUIP_PLUS, statut: "Louée", immatriculation: "52118-A-33", couleur: "Blanc", kilometrage: 21700, photos: ["hyundai-tucson-1", "hyundai-tucson-2", "hyundai-tucson-3"], ajouteIlYa: 200 },
  { id: "vw-t-roc", marque: "Volkswagen", modele: "T-Roc", annee: 2023, categorie: "SUV", boite: "Automatique", carburant: "Essence", places: 5, portes: 5, bagages: 3, climatisation: true, prixParJour: 650, equipements: EQUIP_PLUS, statut: "Disponible", immatriculation: "47629-A-33", couleur: "Blanc Pur", kilometrage: 34200, photos: ["vw-t-roc-1", "vw-t-roc-2", "vw-t-roc-3"], ajouteIlYa: 340 },
  { id: "dacia-duster", marque: "Dacia", modele: "Duster", annee: 2023, categorie: "SUV", boite: "Manuelle", carburant: "Diesel", places: 5, portes: 5, bagages: 3, climatisation: true, prixParJour: 450, equipements: [...EQUIP_BASE, "Écran tactile", "Caméra de recul"], statut: "Disponible", immatriculation: "46051-A-33", couleur: "Orange Arizona", kilometrage: 41800, photos: ["dacia-duster-1", "dacia-duster-2"], ajouteIlYa: 380 },
  { id: "peugeot-3008", marque: "Peugeot", modele: "3008", annee: 2023, categorie: "SUV", boite: "Automatique", carburant: "Diesel", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 750, equipements: EQUIP_PLUS, statut: "Disponible", immatriculation: "49387-A-33", couleur: "Gris Titane", kilometrage: 28900, photos: ["peugeot-3008-1", "peugeot-3008-2", "peugeot-3008-3"], ajouteIlYa: 280 },
  { id: "kia-sportage", marque: "Kia", modele: "Sportage", annee: 2024, categorie: "SUV", boite: "Automatique", carburant: "Diesel", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 700, equipements: EQUIP_PLUS, statut: "En maintenance", immatriculation: "53462-A-33", couleur: "Noir", kilometrage: 15300, photos: ["kia-sportage-1", "kia-sportage-2", "kia-sportage-3"], ajouteIlYa: 120 },
  { id: "peugeot-208", marque: "Peugeot", modele: "208", annee: 2024, categorie: "Citadine", boite: "Manuelle", carburant: "Essence", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 350, equipements: [...EQUIP_BASE, "Écran tactile", "Apple CarPlay / Android Auto"], statut: "Louée", immatriculation: "54780-A-33", couleur: "Gris Sélénium", kilometrage: 12600, photos: ["peugeot-208-1", "peugeot-208-2"], ajouteIlYa: 90 },
  { id: "renault-clio", marque: "Renault", modele: "Clio 5", annee: 2023, categorie: "Citadine", boite: "Manuelle", carburant: "Diesel", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 330, equipements: [...EQUIP_BASE, "Écran tactile", "Régulateur de vitesse"], statut: "Disponible", immatriculation: "47015-A-33", couleur: "Gris Highland", kilometrage: 38700, photos: ["renault-clio-1", "renault-clio-2"], ajouteIlYa: 360 },
  { id: "toyota-yaris", marque: "Toyota", modele: "Yaris Hybride", annee: 2023, categorie: "Citadine", boite: "Automatique", carburant: "Hybride", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 400, equipements: [...EQUIP_BASE, "Écran tactile", "Caméra de recul"], statut: "Disponible", immatriculation: "48846-A-33", couleur: "Gris Argent", kilometrage: 29400, photos: ["toyota-yaris-2", "toyota-yaris-3"], ajouteIlYa: 310 },
  { id: "seat-ibiza", marque: "Seat", modele: "Ibiza", annee: 2022, categorie: "Citadine", boite: "Manuelle", carburant: "Essence", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 330, equipements: [...EQUIP_BASE, "Écran tactile"], statut: "Disponible", immatriculation: "43390-A-33", couleur: "Gris Magnétique", kilometrage: 52300, photos: ["seat-ibiza-1", "seat-ibiza-2"], ajouteIlYa: 420 },
  { id: "dacia-sandero", marque: "Dacia", modele: "Sandero Stepway", annee: 2024, categorie: "Économique", boite: "Manuelle", carburant: "Diesel", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 280, equipements: EQUIP_BASE, statut: "Louée", immatriculation: "55027-A-33", couleur: "Orange Cuivre", kilometrage: 14100, photos: ["dacia-sandero-1", "dacia-sandero-2", "dacia-sandero-3"], ajouteIlYa: 70 },
  { id: "kia-picanto", marque: "Kia", modele: "Picanto", annee: 2023, categorie: "Économique", boite: "Manuelle", carburant: "Essence", places: 4, portes: 5, bagages: 1, climatisation: true, prixParJour: 250, equipements: EQUIP_BASE, statut: "Disponible", immatriculation: "48502-A-33", couleur: "Gris", kilometrage: 33800, photos: ["kia-picanto-1", "kia-picanto-2", "kia-picanto-3"], ajouteIlYa: 330 },
  { id: "hyundai-accent", marque: "Hyundai", modele: "Accent", annee: 2023, categorie: "Économique", boite: "Automatique", carburant: "Essence", places: 5, portes: 4, bagages: 3, climatisation: true, prixParJour: 300, equipements: [...EQUIP_BASE, "Écran tactile"], statut: "Disponible", immatriculation: "49121-A-33", couleur: "Argent", kilometrage: 36500, photos: ["hyundai-accent-1", "hyundai-accent-2"], ajouteIlYa: 290 },
  { id: "dacia-logan", marque: "Dacia", modele: "Logan", annee: 2023, categorie: "Économique", boite: "Manuelle", carburant: "Diesel", places: 5, portes: 4, bagages: 3, climatisation: true, prixParJour: 250, equipements: EQUIP_BASE, statut: "Disponible", immatriculation: "47788-A-33", couleur: "Gris Comète", kilometrage: 45200, photos: ["dacia-logan-1", "dacia-logan-2", "dacia-logan-3"], ajouteIlYa: 400 },
  { id: "dacia-lodgy", marque: "Dacia", modele: "Lodgy 7 places", annee: 2022, categorie: "Van", boite: "Manuelle", carburant: "Diesel", places: 7, portes: 5, bagages: 4, climatisation: true, prixParJour: 500, equipements: [...EQUIP_BASE, "Régulateur de vitesse"], statut: "Disponible", immatriculation: "42614-A-33", couleur: "Gris", kilometrage: 68900, photos: ["dacia-lodgy-2", "dacia-lodgy-3"], ajouteIlYa: 500 },
  { id: "peugeot-rifter", marque: "Peugeot", modele: "Rifter 7 places", annee: 2023, categorie: "Van", boite: "Manuelle", carburant: "Diesel", places: 7, portes: 5, bagages: 5, climatisation: true, prixParJour: 550, equipements: [...EQUIP_PLUS], statut: "Disponible", immatriculation: "49930-A-33", couleur: "Gris Artense", kilometrage: 27600, photos: ["peugeot-rifter-1", "peugeot-rifter-2", "peugeot-rifter-3"], ajouteIlYa: 250 },
  { id: "renault-trafic", marque: "Renault", modele: "Trafic 9 places", annee: 2022, categorie: "Van", boite: "Manuelle", carburant: "Diesel", places: 9, portes: 4, bagages: 6, climatisation: true, prixParJour: 900, equipements: [...EQUIP_BASE, "Régulateur de vitesse", "Caméra de recul"], statut: "Disponible", immatriculation: "44258-A-33", couleur: "Blanc", kilometrage: 74300, photos: ["renault-trafic-3"], ajouteIlYa: 450 },
];

export const cars: Car[] = seeds.map(car);
