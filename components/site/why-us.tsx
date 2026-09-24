"use client";

import { motion } from "motion/react";
import { Headphones, Palette, Smartphone, Zap } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

const reasons = [
  { icon: Zap, title: "Livré en 7 jours", text: "Avec les offres Éco, Pro et Premium, votre site est en ligne en 7 jours, pas en quelques mois." },
  { icon: Palette, title: "Design moderne", text: "Un site unique qui donne confiance et vous démarque de la concurrence." },
  { icon: Smartphone, title: "Adapté au mobile", text: "Parfait sur téléphone, là où se trouvent la majorité de vos clients." },
  { icon: Headphones, title: "Accompagnement", text: "On reste disponibles après la mise en ligne pour vous aider." },
];

export function WhyUs() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          badge="Pourquoi NUVEX"
          title="Simple, rapide, efficace"
          subtitle="On s'occupe de tout, vous vous concentrez sur votre activité."
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
