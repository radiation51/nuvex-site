import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/format";

export function WhatsAppButton({ phone }: { phone: string }) {
  if (!phone) return null;

  return (
    <a
      href={whatsappLink(phone, "Bonjour NUVEX, je souhaite des informations sur vos offres.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110 sm:right-6 sm:bottom-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 motion-reduce:hidden" />
      <MessageCircle className="relative size-7" />
    </a>
  );
}
