"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Briefcase,
  Check,
  ChevronDown,
  CircleArrowUp,
  Clock,
  Crown,
  FilePlus,
  Gem,
  Gift,
  Globe,
  GraduationCap,
  HeartHandshake,
  Languages,
  Link2,
  MapPin,
  Monitor,
  MonitorCog,
  Paintbrush,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  Wrench,
  X,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDA, selectOffer } from "@/lib/format";
import type { Offer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";

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
  /** Remplace « À partir de » au-dessus du prix (ex. « Par an »). */
  priceLabel?: string;
  /** Texte du bouton de choix sur ordinateur (par défaut « Choisir cette offre »). */
  chooseLabel?: string;
}

export interface PricingModuleProps {
  /** Ancre de la section (par défaut « offres »). */
  id?: string;
  title?: string;
  groups: PlanGroup[];
  /** Contenu affiché sous les offres, quel que soit l'onglet (ex. bandeau vers la page Services). */
  after?: React.ReactNode;
  className?: string;
}

/** Icône de chaque offre (aussi utilisée dans le formulaire de contact). */
export const offerIcons: Record<string, React.ElementType> = {
  eco: Rocket,
  pro: Briefcase,
  premium: Crown,
  "sur-mesure": Sparkles,
  "logiciel-essentiel": Monitor,
  "logiciel-pro": Store,
  "logiciel-sur-mesure": Sparkles,
  "suivi-essentiel": ShieldCheck,
  "suivi-confort": HeartHandshake,
  "suivi-serenite": Gem,
  // Services à la carte (page Services)
  traduction: Languages,
  "nouvelle-page": FilePlus,
  "offre-superieure": CircleArrowUp,
  refonte: Paintbrush,
  "google-maps": MapPin,
  "nom-domaine": Link2,
  depannage: Wrench,
  formation: GraduationCap,
  "logiciel-poste": MonitorCog,
};

const tabIcons: Record<string, React.ElementType> = { sites: Globe, logiciels: Monitor };

export function PricingModule({ id = "offres", title, groups, after, className }: PricingModuleProps) {
  const { t } = useI18n();
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
    <section id={id} className={cn("relative w-full bg-muted/40 px-4 py-24 text-foreground md:px-8", className)}>
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
          <div role="tablist" aria-label={t.pricing.tabsLabel} className={cn("inline-flex rounded-full border bg-card p-1 shadow-sm", groups.length < 2 && "hidden")}>
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
          <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title ?? t.pricing.title}</h2>
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
              <PlanWallet plans={group.plans} priceLabel={group.priceLabel} />
              <PlanGrid plans={group.plans} priceLabel={group.priceLabel} chooseLabel={group.chooseLabel} />
              {group.footnote && <p className="mt-10 text-center text-sm text-muted-foreground">{group.footnote}</p>}
            </motion.div>
          </AnimatePresence>
        </div>
        {after}
      </div>
    </section>
  );
}

/**
 * Téléphone : « portefeuille » d'offres. Toutes les cartes sont fermées (nom, description, prix),
 * la flèche en bas à droite ouvre le détail d'une seule carte à la fois.
 */
function PlanWallet({ plans, priceLabel }: { plans: Offer[]; priceLabel?: string }) {
  const { t: all, lang, href } = useI18n();
  const t = all.pricing;
  const [open, setOpen] = React.useState<string | null>(null);
  // Dernier toucher sur une flèche (relance l'onde à chaque fois).
  const [tap, setTap] = React.useState<{ id: string; n: number } | null>(null);

  return (
    <div className="sm:hidden">
      <p className="mb-6 text-center text-sm text-muted-foreground">
        {t.walletIntro}
      </p>

      <div className="flex flex-col gap-4">
        {plans.map((plan) => {
          const Icon = offerIcons[plan.id] ?? Sparkles;
          const onQuote = plan.price === null;
          const isOpen = open === plan.id;
          const detailId = `offre-${plan.id}-detail`;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative isolate rounded-2xl p-4 pb-3 transition-shadow",
                plan.popular
                  ? "mt-3 bg-glass text-white shadow-lg shadow-primary/25 ring-2 ring-primary/40"
                  : "bg-card ring-1 ring-foreground/10",
                isOpen && !plan.popular && "shadow-lg shadow-primary/10"
              )}
            >
              {plan.popular && (
                <>
                  {/* Même effet verre à petits traits que la carte PC */}
                  <div aria-hidden className="fluted pointer-events-none absolute inset-0 -z-10 rounded-2xl" />
                  <div className="absolute inset-x-0 -top-3.5 mx-auto w-fit rounded-full bg-lime px-3.5 py-1 text-xs font-bold text-ink shadow">
                    {t.popular}
                  </div>
                </>
              )}

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-xl",
                    plan.popular ? "bg-white/10 text-lime" : "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg leading-tight font-bold">{plan.name}</h3>
                  <p className={cn("text-sm", plan.popular ? "text-white/70" : "text-muted-foreground")}>{plan.description}</p>
                </div>
              </div>

              <div className="mt-3">
                <span className={cn("block text-[11px] font-medium tracking-wider uppercase", plan.popular ? "text-white/60" : "text-muted-foreground")}>
                  {onQuote ? t.freeQuote : (priceLabel ?? t.from)}
                </span>
                <span className="font-heading text-2xl font-bold whitespace-nowrap">
                  {onQuote ? t.onQuote : formatDA(plan.price!, lang)}
                </span>
              </div>

              {/* Choisir directement, ou ouvrir le détail */}
              <div className="mt-3 flex items-center gap-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => selectOffer(plan.value ?? plan.name, href("/#contact"))}
                  className={cn(
                    "group/choose flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold shadow-sm transition-colors",
                    plan.popular ? "bg-lime text-ink hover:bg-lime/85" : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {onQuote ? t.chooseQuote : t.chooseShort}
                  <ArrowRight className="size-4 transition-transform group-hover/choose:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/choose:-translate-x-0.5" />
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(isOpen ? null : plan.id);
                    setTap((t) => ({ id: plan.id, n: (t?.n ?? 0) + 1 }));
                  }}
                  aria-expanded={isOpen}
                  aria-controls={detailId}
                  className={cn(
                    "flex h-11 shrink-0 items-center gap-1.5 rounded-full ps-3.5 pe-2 text-xs font-semibold tap",
                    plan.popular ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-primary/8 text-primary ring-1 ring-primary/15"
                  )}
                >
                  {isOpen ? t.close : t.details}
                  {/* Flèche : s'enfonce au toucher, pivote avec un petit rebond et lance une onde */}
                  <span className="relative grid size-7 place-items-center">
                    {tap?.id === plan.id && (
                      <motion.span
                        key={tap.n}
                        aria-hidden
                        className={cn("absolute inset-0 rounded-full", plan.popular ? "bg-lime" : "bg-primary")}
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    )}
                    <motion.span
                      className={cn(
                        "relative grid size-7 place-items-center rounded-full",
                        plan.popular ? "bg-lime text-ink" : "bg-primary text-primary-foreground"
                      )}
                      initial={false}
                      animate={{ rotate: isOpen ? 0 : 180 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 380, damping: 14 }}
                    >
                      <ChevronDown className="size-4" />
                    </motion.span>
                  </span>
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={detailId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className={cn("mt-4 border-t pt-4 text-sm", plan.popular ? "border-white/15" : "border-foreground/10")}>
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
                                plan.popular ? "text-white/85" : "text-muted-foreground",
                                !f.included && "line-through opacity-50"
                              )}
                            >
                              {f.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className={cn("mt-3 flex items-center gap-2", plan.popular ? "text-white/70" : "text-muted-foreground")}>
                        <Clock className="size-4 shrink-0" />
                        {plan.delivery}
                      </p>
                      <Button
                        onClick={() => selectOffer(plan.value ?? plan.name, href("/#contact"))}
                        variant={plan.popular ? "default" : "outline"}
                        className={cn(
                          "mt-4 mb-1 h-11 w-full rounded-xl text-sm font-semibold",
                          plan.popular && "bg-lime text-ink hover:bg-lime/85",
                          !plan.popular && "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        )}
                      >
                        {onQuote ? t.askQuote : t.choose}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Tablette et PC : grille des cartes d'offres. */
function PlanGrid({ plans, priceLabel, chooseLabel }: { plans: Offer[]; priceLabel?: string; chooseLabel?: string }) {
  const { t: all, lang, href } = useI18n();
  const t = all.pricing;
  return (
    <div
      className={cn(
        "hidden grid-cols-1 gap-6 sm:grid sm:grid-cols-2 lg:items-stretch",
        plans.length === 3 ? "mx-auto max-w-5xl lg:grid-cols-3" : "lg:grid-cols-4"
      )}
    >
      {plans.map((plan, i) => {
        const Icon = offerIcons[plan.id] ?? Sparkles;
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
                <div className="absolute inset-x-0 -top-3.5 mx-auto w-fit rounded-full bg-lime px-3.5 py-1 text-xs font-bold text-ink shadow">
                  {t.popular}
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
                        <div className="font-heading text-3xl font-bold">{t.onQuote}</div>
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-bold text-emerald-700">
                          <Gift className="size-3.5" />
                          {t.freeQuote}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={cn("text-xs font-medium uppercase tracking-wider", plan.popular ? "text-white/60" : "text-muted-foreground")}>
                          {priceLabel ?? t.from}
                        </span>
                        <div className="font-heading text-3xl font-bold whitespace-nowrap">{formatDA(plan.price!, lang)}</div>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={() => selectOffer(plan.value ?? plan.name, href("/#contact"))}
                    variant={plan.popular ? "default" : "outline"}
                    className={cn(
                      "mb-2 h-11 w-full rounded-xl text-sm font-semibold",
                      plan.popular && "bg-lime text-ink hover:bg-lime/85",
                      onQuote && !plan.popular && "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    {onQuote ? t.askQuote : (chooseLabel ?? t.choose)}
                  </Button>
                </CardContent>
              </div>

              <CardContent
                className={cn(
                  "flex-1 text-start text-sm",
                  wide && "sm:max-lg:border-s sm:max-lg:py-2",
                  wide && (plan.popular ? "border-white/15" : "border-foreground/10")
                )}
              >
                <div>
                  <h3 className="mb-2 font-semibold">{t.inBrief}</h3>
                  <p className={cn("mb-4", plan.popular ? "text-white/70" : "text-muted-foreground")}>✓ {plan.delivery}</p>

                  <h3 className="mb-2 font-semibold">{t.included}</h3>
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
