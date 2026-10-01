import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/constants";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Bonjour AZUR DRIVE, je souhaite louer une voiture.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="no-print fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25D366]" aria-hidden />
      <WhatsAppIcon className="relative size-7" />
    </a>
  );
}
