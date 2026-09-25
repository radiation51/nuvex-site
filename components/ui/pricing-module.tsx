"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, Check, Crown, Gift, Globe, Monitor, Rocket, Sparkles, Store, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDA, selectOffer } from "@/lib/format";
import type { Offer } from "@/lib/types";
import { cn } from "@/lib/utils";

export type { PlanFeature } from "@/lib/types";

/** Un onglet de la section Offres (ex. sites web, logiciels). */
export interface PlanGroup {
  /** Identifiant, aussi utilisé comme ancre (ex. "logiciels" → lien « #logiciels »). */
  id: string;
  label: string;
  /** Petite étiquette à côté du bouton (ex. « Nouveau »). */
  tag?: string;
  subtitle: string;
  plans: Offer[];
  footnote?: string;
}

export interface PricingModuleProps {
  title?: string;
  groups: PlanGroup[];
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

const tabIcons: Record<string, React.ElementType> = { sites: Globe, logiciels: Monitor };

export function PricingModule({ title = "Nos offres", groups, className }: PricingModuleProps) {
  const [active, setActive] = React.useState(groups[0].id);
  const group = groups.find((g) => g.id === active) ?? groups[0];
  const groupIds = groups.map((g) => g.id).join(" ");

  // Les liens « #offres » ouvrent le 1er onglet, « #logiciels » l'onglet correspondant (menu, accueil, footer).
  React.useEffect(() => {
    const ids = groupIds.split(" ");
    const tabFor = (href: string) => {
      const hash = href.slice(href.lastIndexOf("#") + 1);
      if (hash === "offres") return ids[0];
      return ids.includes(hash) ? hash : null;
    };
    const fromUrl = () => {
      const tab = tabFor(window.location.hash);
      if (tab) setActive(tab);
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      const tab = link && tabFor(link.getAttribute("href") ?? "");
      if (tab) setActive(tab);
    };
    // Au rechargement de la page, on repart toujours du 1er onglet (sites web), même si l'adresse garde « #logiciels ».
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type !== "reload") fromUrl();
    window.addEventListener("hashchange", fromUrl);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", fromUrl);
      document.removeEventListener("click", onClick);
    };
  }, [groupIds]);

  return (
    <section id="offres" className={cn("relative w-full bg-muted/40 px-4 py-24 text-foreground md:px-8", className)}>
      {/* Ancres des autres onglets : même position que la section */}
      {groups.slice(1).map((g) => (
        <span key={g.id} id={g.id} aria-hidden className="absolute top-0" />
      ))}

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <div role="tablist" aria-label="Type d'offre" className="inline-flex rounded-full border bg-card p-1 shadow-sm">
            {groups.map((g) => {
              const Icon = tabIcons[g.id] ?? Sparkles;
              const selected = g.id === group.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="offres-panel"
                  onClick={() => setActive(g.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold tap sm:px-5",
                    selected ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {g.label}
                  {g.tag && (
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold", selected ? "bg-lime text-ink" : "bg-lime/70 text-ink")}>
                      {g.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
          <p className="mt-4 min-h-[3.5rem] text-base text-muted-foreground sm:text-lg">{group.subtitle}</p>
        </motion.div>

        <div id="offres-panel" role="tabpanel" className="mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <PlanGrid plans={group.plans} />
              {group.footnote && <p className="mt-10 text-center text-sm text-muted-foreground">{group.footnote}</p>}
            </motion.div>
          </AnimatePresence>
        </div>
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
