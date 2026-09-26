"use client";

import { motion } from "motion/react";
import { Headphones, Palette, Smartphone, Zap } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { useI18n } from "@/components/i18n-provider";

const icons = [Zap, Palette, Smartphone, Headphones];

export function WhyUs() {
  const { t } = useI18n();
  const reasons = t.whyUs.reasons.map((r, i) => ({ ...r, icon: icons[i] }));
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          badge={t.whyUs.badge}
          title={t.whyUs.title}
          subtitle={t.whyUs.subtitle}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
