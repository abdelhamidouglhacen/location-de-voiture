export const BUSINESS = {
  name: "HG SELF DRIVE",
  city: "Agadir",
  address: "Centre-ville, Agadir 80000, Maroc",
  phones: [
    { label: "06 97 58 15 10", href: "tel:+212697581510" },
    { label: "06 61 99 09 25", href: "tel:+212661990925" },
  ],
  whatsapp: "https://wa.me/212697581510",
  email: "hgselfdrive@gmail.com",
  hours: "Service 24h/24, 7j/7",
  slogan: "Best Car For Rent",
  tagline: "Conduisez le meilleur, louez avec nous",
  facebook: "https://www.facebook.com/",
  googleRating: 4.8,
  googleMaps: "https://www.google.com/maps/search/?api=1&query=HG+SELF+DRIVE+Agadir",
  instagram: "https://www.instagram.com/",
} as const;

export const SITE_TITLE = "HG SELF DRIVE – Location de voitures à Agadir";

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/voitures", label: "Nos voitures" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

export const CATEGORIES = ["Économique", "Citadine", "SUV", "Luxe", "Van"] as const;

export const HOURS = Array.from({ length: 24 * 2 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  return `${h}:${i % 2 ? "30" : "00"}`;
});

export function whatsappLink(message: string) {
  return `${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}
