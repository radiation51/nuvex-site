"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CalendarCheck, Lock, MapPin, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { useI18n } from "@/components/i18n-provider";

const ease = [0.16, 1, 0.3, 1] as const;

// Photo d'exemple affichée dans la maquette (site fictif de restaurant).
const DEMO_PHOTO = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=75&auto=format&fit=crop";
// Même taille pour l'ordinateur et le téléphone de la maquette : la photo n'est téléchargée qu'une fois.
const DEMO_SIZES = "(min-width: 1040px) 480px, 45vw";

/** Réglage d'un nuage : distance de dérive et durée d'un aller-retour. */
const drift = (x: number, seconds: number) => ({ "--drift": `${x}px`, "--drift-duration": `${seconds}s` }) as React.CSSProperties;

/**
 * Ciel bleu dégradé avec quelques nuages flous qui dérivent lentement.
 * Animation en CSS (carte graphique), mise en pause dès que l'accueil sort de l'écran.
 */
export function SkyBackground() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-paused={visible ? undefined : ""}
      className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#1f5c9c_0%,#3377b4_38%,#6aa8dd_72%,#b4d6f1_100%)]"
    >
      <div style={drift(40, 26)} className="absolute top-[34%] -left-[8%] h-40 w-[46rem] animate-drift rounded-full bg-white/35 blur-3xl motion-reduce:animate-none" />
      <div style={drift(-50, 32)} className="absolute top-[48%] -right-[10%] h-48 w-[52rem] animate-drift rounded-full bg-white/40 blur-3xl motion-reduce:animate-none" />
      <div style={drift(30, 22)} className="absolute top-[18%] right-[12%] h-24 w-80 animate-drift rounded-full bg-white/20 blur-2xl motion-reduce:animate-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/40 to-transparent" />
    </div>
  );
}

/** Maquette d'un site réalisé (ordinateur + téléphone) qui monte depuis le bas de l'accueil. */
export function SiteMockup() {
  const { t } = useI18n();
  const m = t.mockup;
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.3, delay: 0.9, ease }}
      className="relative z-[5] mx-auto mt-14 -mb-24 w-[min(1040px,92vw)] sm:mt-16 sm:-mb-32 lg:-mb-40"
    >
      {/* Fenêtre de navigateur */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_-20px_rgba(10,40,90,0.55)] ring-1 ring-white/50">
        <div className="flex items-center gap-1.5 border-b bg-[#f4f6fa] px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] text-muted-foreground ring-1 ring-black/5">
            <Lock className="size-3" />
            restaurant-elbahdja.dz
          </span>
        </div>

        {/* Le site d'exemple */}
        <div className="text-start text-ink">
          <div className="flex items-center justify-between px-5 py-3 sm:px-8">
            <span className="font-heading text-sm font-bold sm:text-base">El Bahdja</span>
            <span className="hidden gap-6 text-xs text-muted-foreground sm:flex">
              {m.links.map((link) => (
                <span key={link}>{link}</span>
              ))}
            </span>
            <span className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-white">{m.book}</span>
          </div>

          <div className="grid gap-6 px-5 pt-2 pb-16 sm:grid-cols-[1.05fr_1fr] sm:px-8 sm:pb-24">
            <div className="flex flex-col justify-center">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                <MapPin className="size-3" />
                {m.place}
              </span>
              <p className="mt-2 font-heading text-xl leading-tight font-semibold sm:text-3xl">
                {m.title}
              </p>
              <p className="mt-2 max-w-sm text-xs text-muted-foreground sm:text-sm">
                {m.text}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold text-white sm:text-xs">
                  <CalendarCheck className="size-3.5" />
                  {m.bookTable}
                </span>
                <span className="rounded-full px-4 py-2 text-[11px] font-semibold ring-1 ring-black/10 sm:text-xs">{m.seeMenu}</span>
              </div>
              <span className="mt-4 flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                  ))}
                </span>
                {m.rating}
              </span>
            </div>
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-xl sm:block">
              <Image src={DEMO_PHOTO} alt="" fill sizes={DEMO_SIZES} className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Le même site sur téléphone */}
      <div className="absolute end-[-2%] bottom-[22%] hidden w-[21%] rotate-[4deg] rtl:-rotate-[4deg] rounded-[30px] bg-ink p-1.5 shadow-2xl shadow-black/30 md:block">
        <div className="overflow-hidden rounded-[24px] bg-white text-start text-ink">
          <div className="relative aspect-[4/3]">
            <Image src={DEMO_PHOTO} alt="" fill sizes={DEMO_SIZES} className="object-cover" />
          </div>
          <div className="space-y-2 p-3">
            <p className="font-heading text-sm leading-tight font-semibold">El Bahdja</p>
            <p className="text-[10px] leading-snug text-muted-foreground">{m.short}</p>
            <span className="block rounded-full bg-primary py-1.5 text-center text-[10px] font-semibold text-white">{m.book}</span>
            <span className="flex items-center justify-center gap-1 rounded-full bg-[#25D366]/15 py-1.5 text-[10px] font-semibold text-[#128C4B]">
              <WhatsAppIcon className="size-3" />
              WhatsApp
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
