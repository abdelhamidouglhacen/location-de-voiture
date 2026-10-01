import type { Car } from "@/types";
import { daysFromNow } from "./dates";

type CarSeed = Omit<Car, "prixParSemaine" | "prixParMois" | "images" | "maintenance" | "ajouteLe" | "caution"> & {
  photos: string[];
  caution?: number;
  ajouteIlYa: number;
};

const EQUIP_BASE = ["Air conditioning", "Bluetooth", "Power steering", "Electric windows", "ABS", "Airbags"];
const EQUIP_PLUS = [...EQUIP_BASE, "Touchscreen", "Apple CarPlay / Android Auto", "Reversing camera", "Cruise control"];
const EQUIP_LUXE = [...EQUIP_PLUS, "Leather seats", "Panoramic roof", "Heated seats", "Built-in GPS navigation", "Parking assist"];

const CAUTION: Record<Car["categorie"], number> = {
  Economy: 3000,
  City: 4000,
  SUV: 6000,
  Luxury: 15000,
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
        type: index % 2 ? "Front tyres" : "Brake pads",
        cout: seed.categorie === "Luxury" ? 3800 : 1200,
        kilometrage: seed.kilometrage - 3200,
        prochainEntretien: daysFromNow(DUE_SOON.includes(seed.id) ? 5 + index % 7 : 110 - index),
      },
      {
        id: `m-${seed.id}-1`,
        date: daysFromNow(-120 - index * 3),
        type: "Oil change + filters",
        cout: seed.categorie === "Luxury" ? 2400 : 850,
        kilometrage: seed.kilometrage - 9000,
        prochainEntretien: daysFromNow(-40 - index),
      },
    ],
  };
}

const seeds: CarSeed[] = [
  { id: "mercedes-gle", marque: "Mercedes", modele: "GLE 350d", annee: 2024, categorie: "Luxury", boite: "Automatic", carburant: "Diesel", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 1500, equipements: EQUIP_LUXE, statut: "Rented", immatriculation: "48215-A-33", couleur: "White", kilometrage: 18400, photos: ["mercedes-gle-1", "mercedes-gle-2", "mercedes-gle-3"], ajouteIlYa: 150 },
  { id: "range-rover-evoque", marque: "Range Rover", modele: "Evoque", annee: 2023, categorie: "Luxury", boite: "Automatic", carburant: "Diesel", places: 5, portes: 5, bagages: 3, climatisation: true, prixParJour: 1300, equipements: EQUIP_LUXE, statut: "Available", immatriculation: "51903-A-33", couleur: "Fuji White", kilometrage: 26100, photos: ["range-rover-evoque-1", "range-rover-evoque-2"], ajouteIlYa: 300 },
  { id: "mercedes-classe-c", marque: "Mercedes", modele: "C-Class 200", annee: 2023, categorie: "Luxury", boite: "Automatic", carburant: "Petrol", places: 5, portes: 4, bagages: 3, climatisation: true, prixParJour: 1100, equipements: EQUIP_LUXE, statut: "Available", immatriculation: "39772-A-33", couleur: "White", kilometrage: 31500, photos: ["mercedes-classe-c-1", "mercedes-classe-c-2", "mercedes-classe-c-3"], ajouteIlYa: 260 },
  { id: "bmw-x1", marque: "BMW", modele: "X1 sDrive18d", annee: 2024, categorie: "Luxury", boite: "Automatic", carburant: "Diesel", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 950, equipements: EQUIP_LUXE, statut: "Available", immatriculation: "55310-A-33", couleur: "Cape York Green", kilometrage: 9800, photos: ["bmw-x1-1", "bmw-x1-2", "bmw-x1-3"], ajouteIlYa: 40 },
  { id: "hyundai-tucson", marque: "Hyundai", modele: "Tucson", annee: 2024, categorie: "SUV", boite: "Automatic", carburant: "Hybrid", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 700, equipements: EQUIP_PLUS, statut: "Rented", immatriculation: "52118-A-33", couleur: "White", kilometrage: 21700, photos: ["hyundai-tucson-1", "hyundai-tucson-2", "hyundai-tucson-3"], ajouteIlYa: 200 },
  { id: "vw-t-roc", marque: "Volkswagen", modele: "T-Roc", annee: 2023, categorie: "SUV", boite: "Automatic", carburant: "Petrol", places: 5, portes: 5, bagages: 3, climatisation: true, prixParJour: 650, equipements: EQUIP_PLUS, statut: "Available", immatriculation: "47629-A-33", couleur: "Pure White", kilometrage: 34200, photos: ["vw-t-roc-1", "vw-t-roc-2", "vw-t-roc-3"], ajouteIlYa: 340 },
  { id: "dacia-duster", marque: "Dacia", modele: "Duster", annee: 2023, categorie: "SUV", boite: "Manual", carburant: "Diesel", places: 5, portes: 5, bagages: 3, climatisation: true, prixParJour: 450, equipements: [...EQUIP_BASE, "Touchscreen", "Reversing camera"], statut: "Available", immatriculation: "46051-A-33", couleur: "Arizona Orange", kilometrage: 41800, photos: ["dacia-duster-1", "dacia-duster-2"], ajouteIlYa: 380 },
  { id: "peugeot-3008", marque: "Peugeot", modele: "3008", annee: 2023, categorie: "SUV", boite: "Automatic", carburant: "Diesel", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 750, equipements: EQUIP_PLUS, statut: "Available", immatriculation: "49387-A-33", couleur: "Titanium Grey", kilometrage: 28900, photos: ["peugeot-3008-1", "peugeot-3008-2", "peugeot-3008-3"], ajouteIlYa: 280 },
  { id: "kia-sportage", marque: "Kia", modele: "Sportage", annee: 2024, categorie: "SUV", boite: "Automatic", carburant: "Diesel", places: 5, portes: 5, bagages: 4, climatisation: true, prixParJour: 700, equipements: EQUIP_PLUS, statut: "In maintenance", immatriculation: "53462-A-33", couleur: "Black", kilometrage: 15300, photos: ["kia-sportage-1", "kia-sportage-2", "kia-sportage-3"], ajouteIlYa: 120 },
  { id: "peugeot-208", marque: "Peugeot", modele: "208", annee: 2024, categorie: "City", boite: "Manual", carburant: "Petrol", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 350, equipements: [...EQUIP_BASE, "Touchscreen", "Apple CarPlay / Android Auto"], statut: "Rented", immatriculation: "54780-A-33", couleur: "Selenium Grey", kilometrage: 12600, photos: ["peugeot-208-1", "peugeot-208-2"], ajouteIlYa: 90 },
  { id: "renault-clio", marque: "Renault", modele: "Clio 5", annee: 2023, categorie: "City", boite: "Manual", carburant: "Diesel", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 330, equipements: [...EQUIP_BASE, "Touchscreen", "Cruise control"], statut: "Available", immatriculation: "47015-A-33", couleur: "Highland Grey", kilometrage: 38700, photos: ["renault-clio-1", "renault-clio-2"], ajouteIlYa: 360 },
  { id: "toyota-yaris", marque: "Toyota", modele: "Yaris Hybrid", annee: 2023, categorie: "City", boite: "Automatic", carburant: "Hybrid", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 400, equipements: [...EQUIP_BASE, "Touchscreen", "Reversing camera"], statut: "Available", immatriculation: "48846-A-33", couleur: "Silver Grey", kilometrage: 29400, photos: ["toyota-yaris-2", "toyota-yaris-3"], ajouteIlYa: 310 },
  { id: "seat-ibiza", marque: "Seat", modele: "Ibiza", annee: 2022, categorie: "City", boite: "Manual", carburant: "Petrol", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 330, equipements: [...EQUIP_BASE, "Touchscreen"], statut: "Available", immatriculation: "43390-A-33", couleur: "Magnetic Grey", kilometrage: 52300, photos: ["seat-ibiza-1", "seat-ibiza-2"], ajouteIlYa: 420 },
  { id: "dacia-sandero", marque: "Dacia", modele: "Sandero Stepway", annee: 2024, categorie: "Economy", boite: "Manual", carburant: "Diesel", places: 5, portes: 5, bagages: 2, climatisation: true, prixParJour: 280, equipements: EQUIP_BASE, statut: "Rented", immatriculation: "55027-A-33", couleur: "Copper Orange", kilometrage: 14100, photos: ["dacia-sandero-1", "dacia-sandero-2", "dacia-sandero-3"], ajouteIlYa: 70 },
  { id: "kia-picanto", marque: "Kia", modele: "Picanto", annee: 2023, categorie: "Economy", boite: "Manual", carburant: "Petrol", places: 4, portes: 5, bagages: 1, climatisation: true, prixParJour: 250, equipements: EQUIP_BASE, statut: "Available", immatriculation: "48502-A-33", couleur: "Grey", kilometrage: 33800, photos: ["kia-picanto-1", "kia-picanto-2", "kia-picanto-3"], ajouteIlYa: 330 },
  { id: "hyundai-accent", marque: "Hyundai", modele: "Accent", annee: 2023, categorie: "Economy", boite: "Automatic", carburant: "Petrol", places: 5, portes: 4, bagages: 3, climatisation: true, prixParJour: 300, equipements: [...EQUIP_BASE, "Touchscreen"], statut: "Available", immatriculation: "49121-A-33", couleur: "Silver", kilometrage: 36500, photos: ["hyundai-accent-1", "hyundai-accent-2"], ajouteIlYa: 290 },
  { id: "dacia-logan", marque: "Dacia", modele: "Logan", annee: 2023, categorie: "Economy", boite: "Manual", carburant: "Diesel", places: 5, portes: 4, bagages: 3, climatisation: true, prixParJour: 250, equipements: EQUIP_BASE, statut: "Available", immatriculation: "47788-A-33", couleur: "Comet Grey", kilometrage: 45200, photos: ["dacia-logan-1", "dacia-logan-2", "dacia-logan-3"], ajouteIlYa: 400 },
  { id: "dacia-lodgy", marque: "Dacia", modele: "Lodgy 7-seater", annee: 2022, categorie: "Van", boite: "Manual", carburant: "Diesel", places: 7, portes: 5, bagages: 4, climatisation: true, prixParJour: 500, equipements: [...EQUIP_BASE, "Cruise control"], statut: "Available", immatriculation: "42614-A-33", couleur: "Grey", kilometrage: 68900, photos: ["dacia-lodgy-2", "dacia-lodgy-3"], ajouteIlYa: 500 },
  { id: "peugeot-rifter", marque: "Peugeot", modele: "Rifter 7-seater", annee: 2023, categorie: "Van", boite: "Manual", carburant: "Diesel", places: 7, portes: 5, bagages: 5, climatisation: true, prixParJour: 550, equipements: [...EQUIP_PLUS], statut: "Available", immatriculation: "49930-A-33", couleur: "Artense Grey", kilometrage: 27600, photos: ["peugeot-rifter-1", "peugeot-rifter-2", "peugeot-rifter-3"], ajouteIlYa: 250 },
  { id: "renault-trafic", marque: "Renault", modele: "Trafic 9-seater", annee: 2022, categorie: "Van", boite: "Manual", carburant: "Diesel", places: 9, portes: 4, bagages: 6, climatisation: true, prixParJour: 900, equipements: [...EQUIP_BASE, "Cruise control", "Reversing camera"], statut: "Available", immatriculation: "44258-A-33", couleur: "White", kilometrage: 74300, photos: ["renault-trafic-3"], ajouteIlYa: 450 },
];

export const cars: Car[] = seeds.map(car);
