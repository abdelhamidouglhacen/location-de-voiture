export const BUSINESS = {
  name: "AZUR DRIVE",
  city: "Agadir",
  address: "Avenue Hassan II, Agadir 80000, Morocco",
  phones: [
    { label: "06 00 00 00 00", href: "tel:+212600000000" },
  ],
  whatsapp: "https://wa.me/",
  email: "contact@azurdrive.ma",
  hours: "24/7 service",
  slogan: "Best Car For Rent",
  tagline: "Drive the best, rent with us",
  facebook: "https://www.facebook.com/",
  googleRating: 4.8,
  googleMaps: "https://www.google.com/maps/search/?api=1&query=Avenue+Hassan+II+Agadir",
  instagram: "https://www.instagram.com/",
} as const;

export const SITE_TITLE = "AZUR DRIVE – Car rental in Agadir";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/voitures", label: "Our cars" },
  { href: "/a-propos", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const CATEGORIES = ["Economy", "City", "SUV", "Luxury", "Van"] as const;

export const HOURS = Array.from({ length: 24 * 2 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  return `${h}:${i % 2 ? "30" : "00"}`;
});

export function whatsappLink(message: string) {
  return `${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}
