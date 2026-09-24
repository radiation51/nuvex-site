import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { whatsappLink } from "@/lib/format";

export function WhatsAppButton({ phone }: { phone: string }) {
  if (!phone) return null;

  return (
    <a
      href={whatsappLink(phone, "Bonjour NUVEX, je souhaite des informations sur vos offres.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed right-5 bottom-6 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110 sm:right-7 sm:bottom-8"
    >
      {/* Halo discret, qui reste près du bouton pour ne pas être coupé au bord de l'écran */}
      <span className="absolute inset-0 animate-wa-pulse rounded-full bg-[#25D366] motion-reduce:hidden" />
      <WhatsAppIcon className="relative size-7" />
    </a>
  );
}
