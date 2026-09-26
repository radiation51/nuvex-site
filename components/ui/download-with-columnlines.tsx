"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ColumnLines } from "@/components/ui/download-with-columnlines-utils/columnlines";
import { SiteMockup, SkyBackground } from "@/components/site/hero-visual";
import { useI18n } from "@/components/i18n-provider";

interface DownloadWithColumnLinesProps {
  badge?: string;
  /** Rend le badge cliquable (ex. "#logiciels"). */
  badgeHref?: string;
  /** Petite étiquette colorée devant le badge cliquable (ex. "Nouveau"). */
  badgeTag?: string;
  /** Lignes du titre séparées par "\n". */
  headline?: string;
  subheadline?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

/** Titre qui apparaît mot par mot, avec un léger flou. */
function RevealHeadline({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  let wordIndex = 0;

  return (
    <h1 className="max-w-4xl text-center font-sans text-[2.4rem] leading-[1.08] font-light tracking-tight text-white sm:text-5xl md:text-6xl">
      {text.split("\n").map((line, lineIndex, lines) => (
        <React.Fragment key={lineIndex}>
          {line.split(" ").map((word) => {
            const delay = 0.15 + wordIndex++ * 0.09;
            return (
              <React.Fragment key={`${word}-${delay}`}>
                <motion.span
                  className="inline-block"
                  initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay, ease }}
                >
                  {word}
                </motion.span>{" "}
              </React.Fragment>
            );
          })}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </h1>
  );
}

export default function DownloadWithColumnLines({
  badge,
  badgeHref,
  badgeTag,
  headline,
  subheadline,
  primaryLabel,
  primaryHref = "#contact",
  secondaryLabel,
  secondaryHref = "#offres",
}: DownloadWithColumnLinesProps) {
  // Textes de la langue de la page, sauf s'ils sont fournis.
  const { t } = useI18n();
  headline ??= t.hero.headline;
  subheadline ??= t.hero.subheadline;
  primaryLabel ??= t.hero.primary;
  secondaryLabel ??= t.hero.secondary;

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <ColumnLines
      columnWidth={96}
      columnCount={16}
      radialFadeStart={20}
      radialFadeEnd={65}
      lineClassName="border-white/[0.12]"
      className="relative w-full bg-[#3377b4]"
    >
      {/* Visuel généré : ciel bleu + maquette d'un site réalisé */}
      <SkyBackground />

      <div
        id="accueil"
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-28 sm:pt-32 md:pt-36"
      >
        {badge &&
          (badgeHref ? (
            <motion.a
              {...fadeUp(0)}
              href={badgeHref}
              className="group mb-5 flex items-center gap-2 rounded-full bg-white/15 py-1.5 ps-1.5 pe-3 text-sm font-medium text-white ring-1 ring-white/30 backdrop-blur-md tap hover:bg-white/25"
            >
              {badgeTag && <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold text-ink">{badgeTag}</span>}
              {badge}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </motion.a>
          ) : (
            <motion.span
              {...fadeUp(0)}
              className="mb-5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/30 backdrop-blur-md"
            >
              {badge}
            </motion.span>
          ))}

        <RevealHeadline text={headline} />

        {subheadline && (
          <motion.p {...fadeUp(0.7)} className="mt-4 max-w-2xl text-center text-sm text-white/90 sm:text-base">
            {subheadline}
          </motion.p>
        )}

        <motion.div {...fadeUp(0.85)} className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={primaryHref}
            className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-black/10 tap hover:-translate-y-0.5"
          >
            {primaryLabel}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
          </a>
          <a
            href={secondaryHref}
            className="rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/35 backdrop-blur-md tap hover:bg-white/25"
          >
            {secondaryLabel}
          </a>
        </motion.div>

        <SiteMockup />
      </div>
    </ColumnLines>
  );
}
