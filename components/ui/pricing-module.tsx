"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Briefcase, Check, Crown, Gift, Monitor, Rocket, Sparkles, Store, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { formatDA, selectOffer } from "@/lib/format";
import type { Offer } from "@/lib/types";
import { cn } from "@/lib/utils";

export type { PlanFeature } from "@/lib/types";

export interface PricingModuleProps {
  /** Ancre de la section (ex. "offres", "logiciels"). */
  id?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  plans: Offer[];
  footnote?: string;
  /** Fond légèrement grisé (par défaut) ou fond de page. */
  muted?: boolean;
  className?: string;
}

const icons: Record<string, React.ElementType> = {
  eco: Rocket,
  pro: Briefcase,
  premium: Crown,
  "sur-mesure": Sparkles,
  "logiciel-essentiel": Monitor,
  "logiciel-pro": Store,
  "logiciel-sur-mesure": Sparkles,
};

export function PricingModule({
  id = "offres",
  badge = "Tarifs",
  title = "Nos offres",
  subtitle = "Des prix clairs, sans surprise. Choisissez la formule adaptée à votre projet.",
  plans,
  footnote,
  muted = true,
  className,
}: PricingModuleProps) {
  return (
    <section id={id} className={cn("w-full px-4 py-24 text-foreground md:px-8", muted ? "bg-muted/40" : "bg-background", className)}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading badge={badge} title={title} subtitle={subtitle} />
        <div className="mt-16">
          <PlanGrid plans={plans} />
        </div>
        {footnote && <p className="mt-10 text-center text-sm text-muted-foreground">{footnote}</p>}
      </div>
    </section>
  );
}

/** Grille des cartes d'offres. */
function PlanGrid({ plans }: { plans: Offer[] }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:items-stretch",
        plans.length === 3 ? "mx-auto max-w-5xl lg:grid-cols-3" : "lg:grid-cols-4"
      )}
    >
      {plans.map((plan, i) => {
        const Icon = icons[plan.id] ?? Sparkles;
        const onQuote = plan.price === null;
        // Nombre impair d'offres : sur 2 colonnes (tablette), la dernière carte prend toute la largeur.
        const wide = plans.length % 2 === 1 && i === plans.length - 1;

        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            viewport={{ once: true }}
            className={cn("flex", wide && "sm:max-lg:col-span-2")}
          >
            <Card
              className={cn(
                "relative flex w-full flex-col overflow-visible rounded-2xl border-0 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10",
                plan.popular && "isolate bg-glass text-white ring-2 ring-primary/40 lg:scale-[1.04]",
                wide && "sm:max-lg:grid sm:max-lg:grid-cols-2 sm:max-lg:items-center"
              )}
            >
              {plan.popular && (
                // Rappel de l'effet verre du footer
                <div aria-hidden className="fluted pointer-events-none absolute inset-0 -z-10 rounded-2xl" />
              )}
              {plan.popular && (
                <div className="absolute -top-3.5 left-0 right-0 mx-auto w-fit rounded-full bg-lime px-3.5 py-1 text-xs font-bold text-ink shadow">
                  Le plus populaire
                </div>
              )}

              <div className="flex flex-col gap-(--card-spacing)">
                <CardHeader className="pt-6 text-center">
                  <div className="mb-3 flex justify-center">
                    <span
                      className={cn(
                        "grid size-12 place-items-center rounded-xl",
                        plan.popular ? "bg-white/10 text-lime" : "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="size-6" />
                    </span>
                  </div>
                  <CardTitle className="font-heading text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className={cn(plan.popular && "text-white/65")}>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col text-center">
                  <div className="mb-5 flex min-h-[4.5rem] flex-col items-center justify-center">
                    {onQuote ? (
                      <>
                        <div className="font-heading text-3xl font-bold">Sur devis</div>
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-bold text-emerald-700">
                          <Gift className="size-3.5" />
                          Devis 100 % gratuit
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={cn("text-xs font-medium uppercase tracking-wider", plan.popular ? "text-white/60" : "text-muted-foreground")}>
                          À partir de
                        </span>
                        <div className="font-heading text-3xl font-bold whitespace-nowrap">{formatDA(plan.price!)}</div>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={() => selectOffer(plan.name)}
                    variant={plan.popular ? "default" : "outline"}
                    className={cn(
                      "mb-2 h-11 w-full rounded-xl text-sm font-semibold",
                      plan.popular && "bg-lime text-ink hover:bg-lime/85",
                      onQuote && !plan.popular && "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    {onQuote ? "Demander mon devis gratuit" : "Choisir cette offre"}
                  </Button>
                </CardContent>
              </div>

              <CardContent
                className={cn(
                  "flex-1 text-left text-sm",
                  wide && "sm:max-lg:border-l sm:max-lg:py-2",
                  wide && (plan.popular ? "border-white/15" : "border-foreground/10")
                )}
              >
                <div>
                  <h3 className="mb-2 font-semibold">En bref</h3>
                  <p className={cn("mb-4", plan.popular ? "text-white/70" : "text-muted-foreground")}>✓ {plan.delivery}</p>

                  <h3 className="mb-2 font-semibold">Inclus</h3>
                  <ul className="space-y-2">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        {f.included ? (
                          <Check className={cn("mt-0.5 size-4 shrink-0", plan.popular ? "text-lime" : "text-primary")} />
                        ) : (
                          <X className="mt-0.5 size-4 shrink-0 opacity-40" />
                        )}
                        <span
                          className={cn(
                            plan.popular ? "text-white/80" : "text-muted-foreground",
                            !f.included && "line-through opacity-50"
                          )}
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
