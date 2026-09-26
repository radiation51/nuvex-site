"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BellRing, Languages, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { GlassPanel } from "@/components/site/glass-panel";

/** Bandeau sous les offres de l'accueil : présente les formules de suivi et les services, mène à la page Services. */
export function ServicesTeaser() {
  const { t: all, href } = useI18n();
  const t = all.servicesTeaser;
  const icons = [ShieldCheck, BellRing, MapPin, Languages, Wrench];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      className="mt-14"
    >
      <GlassPanel className="rounded-3xl p-6 shadow-2xl shadow-primary/20 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-2.5 py-1 text-xs font-bold text-ink">{t.badge}</span>
            <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h3>
            <p className="mt-2 text-sm text-white/75 sm:text-base">{t.text}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {t.items.map((item, i) => {
                const Icon = icons[i] ?? ShieldCheck;
                return (
                  <li key={item} className="flex items-center gap-1.5 rounded-full bg-white/10 py-1 ps-1 pe-3 text-xs font-medium ring-1 ring-white/15">
                    <span className="grid size-5 place-items-center rounded-full bg-white/15 text-lime">
                      <Icon className="size-3" />
                    </span>
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <p className="text-sm text-white/70">
              {t.from} <strong className="font-heading text-2xl text-white">{t.price}</strong> {t.perYear}
            </p>
            <Link
              href={href("/services")}
              className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg tap hover:-translate-y-0.5"
            >
              {t.cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
