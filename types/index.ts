export type Categorie = "Economy" | "City" | "SUV" | "Luxury" | "Van";
export type Boite = "Manual" | "Automatic";
export type Carburant = "Petrol" | "Diesel" | "Hybrid";
export type StatutVoiture = "Available" | "Rented" | "In maintenance";

export interface MaintenanceEntry {
  id: string;
  date: string;
  type: string;
  cout: number;
  kilometrage: number;
  prochainEntretien: string;
}

export interface Car {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  categorie: Categorie;
  boite: Boite;
  carburant: Carburant;
  places: number;
  portes: number;
  bagages: number;
  climatisation: boolean;
  prixParJour: number;
  prixParSemaine: number;
  prixParMois: number;
  caution: number;
  images: string[];
  equipements: string[];
  statut: StatutVoiture;
  immatriculation: string;
  couleur: string;
  kilometrage: number;
  maintenance: MaintenanceEntry[];
  ajouteLe: string;
}

export type StatutReservation = "Pending" | "Confirmed" | "Ongoing" | "Completed" | "Cancelled";
export type StatutPaiement = "Pending" | "Paid" | "Refunded";
export type ModePaiement = "agence" | "carte";

export interface EtatVehicule {
  kilometrage: number;
  carburant: string;
  dommages: string;
}

export interface BookingEvent {
  statut: StatutReservation;
  date: string;
  note?: string;
}

export interface Booking {
  id: string;
  reference: string;
  clientId: string;
  voitureId: string;
  lieuDepartId: string;
  lieuRetourId: string;
  dateDepart: string;
  dateRetour: string;
  options: string[];
  nombreJours: number;
  sousTotal: number;
  optionsTotal: number;
  remise: number;
  total: number;
  statutPaiement: StatutPaiement;
  statut: StatutReservation;
  modePaiement: ModePaiement;
  numeroVol?: string;
  notes: string;
  historique: BookingEvent[];
  etatDepart?: EtatVehicule;
  etatRetour?: EtatVehicule;
  creeLe: string;
}

export interface Customer {
  id: string;
  nomComplet: string;
  email: string;
  telephone: string;
  nationalite: string;
  numeroPermis: string;
  expirationPermis: string;
  pieceIdentite: string;
  age: number;
  nombreLocations: number;
  totalDepense: number;
  listeNoire: boolean;
  raisonListeNoire?: string;
  notes: string;
  creeLe: string;
}

export interface Extra {
  id: string;
  nom: string;
  description: string;
  prix: number;
  unite: "jour" | "forfait";
}

export interface Location {
  id: string;
  nom: string;
  adresse: string;
}

export interface DriverInfo {
  nomComplet: string;
  email: string;
  telephone: string;
  age: string;
  numeroPermis: string;
  expirationPermis: string;
  pieceIdentite: string;
  numeroVol: string;
  remarques: string;
}
