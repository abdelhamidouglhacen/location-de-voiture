export type Category = "Economy" | "City" | "SUV" | "Luxury" | "Van";
export type Gearbox = "Manual" | "Automatic";
export type FuelType = "Petrol" | "Diesel" | "Hybrid";
export type CarStatus = "Available" | "Rented" | "In maintenance";

export interface MaintenanceEntry {
  id: string;
  date: string;
  type: string;
  cost: number;
  mileage: number;
  next_service: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: Category;
  gearbox: Gearbox;
  fuel_type: FuelType;
  seats: number;
  doors: number;
  luggage: number;
  air_conditioning: boolean;
  price_per_day: number;
  price_per_week: number;
  price_per_month: number;
  deposit: number;
  images: string[];
  features: string[];
  status: CarStatus;
  registration: string;
  color: string;
  mileage: number;
  maintenance: MaintenanceEntry[];
  created_at: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Ongoing" | "Completed" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Refunded";
export type PaymentMethod = "agency" | "card";

export interface VehicleCondition {
  mileage: number;
  fuel: string;
  damages: string;
}

export interface BookingEvent {
  status: BookingStatus;
  date: string;
  note?: string;
}

export interface Booking {
  id: string;
  reference: string;
  customer_id: string;
  car_id: string;
  pickup_location_id: string;
  return_location_id: string;
  pickup_date: string;
  return_date: string;
  extras: string[];
  days: number;
  subtotal: number;
  extras_total: number;
  discount: number;
  total: number;
  payment_status: PaymentStatus;
  status: BookingStatus;
  payment_method: PaymentMethod;
  flight_number?: string;
  notes: string;
  history: BookingEvent[];
  pickup_condition?: VehicleCondition;
  return_condition?: VehicleCondition;
  created_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  license_number: string;
  license_expiry: string;
  id_document: string;
  age: number;
  rentals_count: number;
  total_spent: number;
  blacklisted: boolean;
  blacklist_reason?: string;
  notes: string;
  created_at: string;
}

export interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: "day" | "flat";
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface DriverInfo {
  full_name: string;
  email: string;
  phone: string;
  age: string;
  license_number: string;
  license_expiry: string;
  id_document: string;
  flight_number: string;
  remarks: string;
}