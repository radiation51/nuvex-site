"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Boxes,
  CalendarCheck,
  Car,
  DatabaseBackup,
  GraduationCap,
  HandCoins,
  Languages,
  Receipt,
  Scissors,
  Store,
  TriangleAlert,
  Users,
  UtensilsCrossed,
  Warehouse,
  WifiOff,
} from "lucide-react";
import { GlassPanel } from "@/components/site/glass-panel";
import { SectionHeading } from "@/components/site/section-heading";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { PlanGrid } from "@/components/ui/pricing-module";
import { whatsappLink } from "@/lib/format";
import type { Offer } from "@/lib/types";

const strengths = [
  { icon: WifiOff, label: "Fonctionne sans internet" },
  { icon: Receipt, label: "Encaissement, tickets et factures" },
  { icon: Boxes, label: "Stock et alertes de rupture" },
  { icon: HandCoins, label: "Crédit clients et fournisseurs" },
  { icon: Users, label: "Comptes patron et employés" },
  { icon: Languages, label: "En français et en arabe" },
  { icon: DatabaseBackup, label: "Sauvegarde automatique" },
  { icon: GraduationCap, label: "Installation et formation sur place" },
];

const activities = [
  { icon: Store, title: "Magasins & supérettes", text: "Caisse, codes-barres, stock et crédit clients." },
  { icon: Warehouse, title: "Grossistes & dépôts", text: "Stock, bons de livraison, dettes clients et fournisseurs." },
  { icon: Car, title: "Location de voitures & matériel", text: "Véhicules, contrats, cautions et disponibilités." },
  { icon: Scissors, title: "Ateliers & tailleurs", text: "Commandes sur mesure, mensurations et suivi." },
  { icon: UtensilsCrossed, title: "Restaurants & cafés", text: "Commandes par table, cuisine et caisse." },
  { icon: CalendarCheck, title: "Salons, cabinets & auto-écoles", text: "Rendez-vous, fiches clients et paiements." },
];

const ticket = [
  { item: "Huile d'olive 1 L", qty: 2, total: "2 400" },
  { item: "Café 250 g", qty: 1, total: "450" },
  { item: "Sucre 1 kg", qty: 3, total: "360" },
];

/** Aperçu d'un écran de caisse : illustre un logiciel qui tourne même hors connexion. */
function CashierMockup() {
  return (
    <div className="overflow-hidden rounded-xl bg-white text-ink shadow-2xl shadow-black/25">
      <div className="flex items-center gap-1.5 border-b bg-muted/60 px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] font-semibold text-muted-foreground">Caisse</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          <WifiOff className="size-3" />
          Hors ligne · tout fonctionne
        </span>
      </div>

      <div className="grid gap-3 p-4 text-sm">
        <ul className="grid gap-2">
          {ticket.map((line) => (
            <li key={line.item} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
              <span className="truncate font-medium">{line.item}</span>
              <span className="flex shrink-0 items-center gap-4 text-muted-foreground">
                <span>× {line.qty}</span>
                <span className="w-16 text-right font-semibold text-ink">{line.total} DA</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/12 px-3 py-1.5 text-xs font-medium text-amber-800">
          <TriangleAlert className="size-3.5 shrink-0" />
          Stock bas : Café 250 g (3 restants)
        </div>

        <div className="flex items-end justify-between border-t pt-3">
          <span className="text-muted-foreground">Total</span>
          <span className="font-heading text-2xl font-bold">3 210 DA</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground">Encaisser</span>
          <span className="rounded-lg border py-2 text-center text-sm font-semibold">Imprimer le ticket</span>
        </div>
      </div>
    </div>
  );
}

export function Software({ plans, whatsapp }: { plans: Offer[]; whatsapp?: string }) {
  return (
    <section id="logiciels" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          badge="Nouveau · Logiciels"
          title="Un logiciel fait pour votre activité"
          subtitle="Qui marche même sans internet. Caisse, stock, clients, crédit : on le conçoit pour vous, en français et en arabe."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassPanel className="flex h-full items-center rounded-2xl p-5 sm:p-8">
              <div className="w-full">
                <CashierMockup />
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-2xl border bg-card p-6 sm:p-8"
          >
            <h3 className="font-heading text-xl font-bold">Internet coupé ? La caisse continue.</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Le logiciel est installé sur votre PC et vos données restent chez vous. Vous vendez, encaissez et suivez votre stock,
              avec ou sans connexion.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {strengths.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm font-medium">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
              <a
                href="#contact"
                className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Parler de mon logiciel
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              {whatsapp && (
                <a
                  href={whatsappLink(whatsapp, "Bonjour NUVEX, je voudrais une démonstration de logiciel pour mon activité.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  <WhatsAppIcon className="size-4" />
                  Demander une démo
                </a>
              )}
            </div>
          </motion.div>
        </div>

        <h3 className="mt-20 text-center font-heading text-2xl font-bold tracking-tight sm:text-3xl">Pour chaque activité</h3>
        <p className="mt-2 text-center text-muted-foreground">Quelques exemples. Votre métier n&apos;y est pas ? On s&apos;adapte.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              viewport={{ once: true }}
              className="group flex items-start gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <div>
                <h4 className="font-heading font-semibold">{title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <h3 className="mt-20 text-center font-heading text-2xl font-bold tracking-tight sm:text-3xl">Nos offres logiciels</h3>
        <p className="mt-2 text-center text-muted-foreground">Le logiciel est à vous : vous le payez une seule fois.</p>
        <div className="mt-14">
          <PlanGrid plans={plans} />
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Acompte de 50 % à la commande, le reste à l&apos;installation. Suivi annuel facultatif (mises à jour + assistance) :
          10 000 DA / an.
        </p>
      </div>
    </section>
  );
}
