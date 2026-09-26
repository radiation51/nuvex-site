import Link from "next/link";
import { Doto } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const doto = Doto({ subsets: ["latin"], weight: ["700", "900"] });

interface Error404Props {
  postcardImage?: string;
  postcardAlt?: string;
  curvedTextTop?: string;
  curvedTextBottom?: string;
  heading?: string;
  subtext?: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Fin de l'adresse affichée sur la carte postale. */
  postcardSlug?: string;
  postcardLabel?: string;
  /** Police « pixel » du titre (désactivée pour l'arabe, qu'elle ne sait pas afficher). */
  pixelHeading?: boolean;
}

// Carte postale par défaut : une mini-page NUVEX « perdue », dessinée en code (aucune image à charger).
function LostSitePostcard({ slug, label }: { slug: string; label: string }) {
  return (
    <div className="flex h-[220px] w-[300px] flex-col overflow-hidden bg-white sm:w-[360px]">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="size-2 rounded-full bg-red-400" />
        <span className="size-2 rounded-full bg-amber-400" />
        <span className="size-2 rounded-full bg-emerald-400" />
        <span className="ml-2 flex-1 truncate rounded-md bg-white px-2 py-0.5 text-[10px] text-slate-400 ring-1 ring-slate-200">
          nuvex-algerie.netlify.app/<span className="text-red-400">{slug}</span>
        </span>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center bg-linear-to-br from-[oklch(0.5_0.24_268)] to-[oklch(0.72_0.12_240)] text-white">
        <span className={cn(doto.className, "text-7xl leading-none font-black tracking-wider")}>404</span>
        <span className="mt-2 text-[11px] font-medium tracking-[0.2em] text-white/80 uppercase">{label}</span>
        <div className="absolute inset-x-6 bottom-3 flex gap-2 opacity-40">
          <span className="h-1.5 flex-1 rounded-full bg-white" />
          <span className="h-1.5 w-10 rounded-full bg-white" />
          <span className="h-1.5 w-6 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}

export function Error404({
  postcardImage,
  postcardAlt = "",
  curvedTextTop = "NUVEX · Sites web & logiciels",
  curvedTextBottom = "Algérie",
  heading = "(404) Cette page s'est perdue en chemin.",
  subtext = "Pas de panique : ici, même les détours mènent quelque part.",
  backButtonLabel = "Retour à l'accueil",
  backButtonHref = "/",
  secondaryLabel,
  secondaryHref,
  postcardSlug = "page-perdue",
  postcardLabel = "Page introuvable",
  pixelHeading = true,
}: Error404Props) {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="flex flex-col items-center">
        <div dir="ltr" className="relative mb-16">
          <svg
            className="animate-spin-slow pointer-events-none absolute -top-16 -left-3 z-20 size-[140px] sm:-left-12"
            viewBox="0 0 140 140"
            aria-hidden
          >
            <defs>
              <path id="circlePath" d="M 70,70 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" fill="transparent" />
            </defs>
            <text className="fill-foreground font-heading text-[10.5px] uppercase" style={{ letterSpacing: "0.15em" }}>
              <textPath href="#circlePath" startOffset="0%">
                {curvedTextTop} • {curvedTextBottom} •
              </textPath>
            </text>
          </svg>

          <div className="relative z-10">
            <div className="relative rotate-[4deg] bg-white p-3 shadow-2xl transition-transform duration-300 hover:rotate-0">
              {postcardImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={postcardImage} alt={postcardAlt} className="h-[220px] w-[300px] object-cover sm:w-[360px]" />
              ) : (
                <LostSitePostcard slug={postcardSlug} label={postcardLabel} />
              )}

              {/* Timbre NUVEX, au prix de la page perdue */}
              <div className="absolute -top-5 -right-5 rotate-[8deg] border-2 border-dashed border-primary/60 bg-white p-1 shadow-md">
                <div className="flex size-16 flex-col items-center justify-center bg-primary/5 text-primary">
                  <span className="grid size-6 place-items-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
                    N
                  </span>
                  <span className={cn(doto.className, "mt-1 text-[13px] leading-none font-black")}>404 DA</span>
                </div>
              </div>
            </div>

            {/* Marques d'oblitération postale */}
            <svg
              className="absolute top-1/2 -right-14 hidden h-20 w-28 -translate-y-1/2 sm:block"
              viewBox="0 0 100 60"
              aria-hidden
            >
              {[15, 25, 35].map((y) => (
                <path
                  key={y}
                  d={`M 10 ${y} Q 20 ${y - 5} 30 ${y} Q 40 ${y + 5} 50 ${y} Q 60 ${y - 5} 70 ${y} Q 80 ${y + 5} 90 ${y}`}
                  stroke="#888"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="max-w-2xl text-center">
          <h1 className={cn(pixelHeading ? doto.className : "font-heading", "mb-6 text-4xl leading-tight font-bold text-balance md:text-5xl")}>
            {heading}
          </h1>
          <p className="mb-10 text-base text-muted-foreground md:text-lg">{subtext}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={backButtonHref} className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-lg px-6")}>
              {backButtonLabel}
              <ArrowRight className="size-4 rtl:-scale-x-100" />
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-lg px-6")}
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
