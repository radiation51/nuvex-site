"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/site/section-heading";
import { useI18n } from "@/components/i18n-provider";

export function Steps() {
  const { t } = useI18n();
  const steps = t.steps.items;
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading badge={t.steps.badge} title={t.steps.title} />
        <div className="relative mt-16">
        <div aria-hidden className="absolute inset-x-[12%] top-6 hidden h-px border-t-2 border-dashed border-primary/25 md:block" />
        <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              viewport={{ once: true }}
              className="relative flex gap-4 md:flex-col md:items-center md:text-center"
            >
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-primary font-heading text-lg font-bold text-primary-foreground ring-8 ring-background">
                {i + 1}
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold md:mt-4">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
