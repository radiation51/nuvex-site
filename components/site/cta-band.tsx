import { ArrowRight } from "lucide-react";
import { GlassPanel, OutlineText } from "@/components/site/glass-panel";
import { whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";

/** Bandeau de rappel entre les sections : même style que le footer (texte en contour + panneau verre). */
export function CtaBand({
  outline,
  title,
  text,
  whatsapp,
}: {
  outline: string;
  title: string;
  text: string;
  whatsapp?: string;
}) {
  return (
    <section className="overflow-hidden px-4 pt-8 pb-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative z-0 flex justify-center">
          <OutlineText className="-mb-2 text-[19vw] sm:text-[120px] md:-mb-4 md:text-[160px]">{outline}</OutlineText>
        </div>
        <GlassPanel shader className="z-10 rounded-3xl px-6 py-10 shadow-2xl shadow-primary/20 sm:px-10 md:px-14 md:py-14">
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
              <p className="mt-3 text-base text-white/75 md:text-lg">{text}</p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
              <a
                href="#contact"
                className="group flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-lg tap hover:-translate-y-0.5"
              >
                Demander mon devis gratuit
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              {whatsapp ? (
                <a
                  href={whatsappLink(whatsapp, "Bonjour NUVEX, je souhaite un devis pour mon site web.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/70 px-6 py-3 text-sm font-semibold tap hover:bg-white hover:text-primary"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </a>
              ) : (
                <a
                  href="#offres"
                  className="flex items-center justify-center rounded-xl border-2 border-white/70 px-6 py-3 text-sm font-semibold tap hover:bg-white hover:text-primary"
                >
                  Voir les offres
                </a>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
