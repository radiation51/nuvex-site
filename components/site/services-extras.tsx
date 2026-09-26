"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { SectionHeading } from "@/components/site/section-heading";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { offerIcons } from "@/components/ui/pricing-module";
import { fill } from "@/lib/i18n/fill";
import { selectOffer, whatsappLink } from "@/lib/format";
import type { ServiceGroup } from "@/lib/services";

/** Services à la carte de la page « Services », rangés par thème. */
export function ServicesExtras({ groups, whatsapp }: { groups: ServiceGroup[]; whatsapp?: string }) {
  const { t: all } = useI18n();
  const t = all.services;
  let index = 0;

  return (
    <section id="a-la-carte" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading badge={t.extrasBadge} title={t.extrasTitle} subtitle={t.extrasSubtitle} />

        <div className="mt-14 grid gap-12">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-5 flex items-center gap-3 font-heading text-lg font-bold">
                <span className="h-px w-8 bg-primary/40" />
                {group.title}
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => {
                  const Icon = offerIcons[item.id] ?? Sparkles;
                  const delay = (index++ % 6) * 0.06;
                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay }}
                      viewport={{ once: true }}
                      className="group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
                    >
                      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-5" />
                      </span>
                      <h4 className="mt-5 font-heading text-lg font-semibold">{item.name}</h4>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

                      <div className="mt-5 flex items-center gap-2 border-t pt-4">
                        <span className="me-auto rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-bold text-emerald-700">{t.onQuote}</span>
                        {whatsapp && (
                          <a
                            href={whatsappLink(whatsapp, fill(t.waService, { service: item.name }))}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t.askWhatsapp}
                            title={t.askWhatsapp}
                            className="grid size-9 place-items-center rounded-full bg-[#25D366]/15 text-[#128C4B] tap hover:bg-[#25D366] hover:text-white"
                          >
                            <WhatsAppIcon className="size-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => selectOffer(item.value ?? item.name, "#contact")}
                          className="group/ask flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground tap hover:bg-primary/90"
                        >
                          {t.ask}
                          <ArrowRight className="size-3.5 transition-transform group-hover/ask:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/ask:-translate-x-0.5" />
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
