"use client";

import * as React from "react";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  ChevronRight,
  Clock,
  FolderKanban,
  Inbox,
  Percent,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { AdminData } from "@/components/admin/admin-data";
import { PageHeader, StatTile } from "@/components/admin/ui-bits";
import { formatDA } from "@/lib/format";
import {
  balanceAmount,
  balanceDue,
  daysUntil,
  depositAmount,
  depositDue,
  formatLongDate,
  isLate,
  relativeDay,
  remainingAmount,
  todayISO,
} from "@/lib/orders";
import { cn } from "@/lib/utils";

export type AdminTab = "dashboard" | "calendar" | "reservations" | "orders" | "clients" | "reviews" | "offers" | "portfolio" | "settings";

const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "short" });
const monthLong = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

export function DashboardPanel({ data, onNavigate }: { data: AdminData; onNavigate: (tab: AdminTab) => void }) {
  const { orders, leads, reviews, offers, clientById } = data;
  const today = todayISO();
  const month = today.slice(0, 7);

  const active = orders.filter((o) => o.status === "todo" || o.status === "in_progress");
  const late = active.filter(isLate);
  const depositsWaiting = orders.filter(depositDue);
  const deliveredUnpaid = orders.filter((o) => o.status === "delivered" && balanceDue(o));
  const sum = (list: typeof orders, fn: (o: (typeof orders)[number]) => number) => list.reduce((t, o) => t + fn(o), 0);

  const paidInMonth = (ym: string) =>
    orders.reduce(
      (t, o) => t + (o.deposit_paid_at?.startsWith(ym) ? depositAmount(o) : 0) + (o.balance_paid_at?.startsWith(ym) ? balanceAmount(o) : 0),
      0
    );
  const signedThisMonth = sum(orders.filter((o) => o.status !== "cancelled" && o.created_at.startsWith(month)), (o) => o.price);

  const newLeads = leads.filter((l) => l.status === "new");
  const decided = leads.filter((l) => l.status === "converted" || l.status === "cancelled" || l.status === "contacted");
  const conversion = decided.length ? Math.round((leads.filter((l) => l.status === "converted").length / decided.length) * 100) : 0;

  const approved = reviews.filter((r) => r.status === "approved" && !r.id.startsWith("demo-"));
  const approvedAll = reviews.filter((r) => r.status === "approved");
  const avgSource = approved.length ? approved : approvedAll;
  const avgRating = avgSource.length ? avgSource.reduce((t, r) => t + r.rating, 0) / avgSource.length : 0;
  const pendingReviews = reviews.filter((r) => r.status === "pending");

  // 6 derniers mois d'encaissements
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { ym, label: monthLabel.format(d).replace(".", ""), long: monthLong.format(d), value: paidInMonth(ym) };
  });

  // Réservations par offre
  const byOffer = offers.map((o) => ({ label: o.name, value: leads.filter((l) => l.offer === o.name).length }));

  // À faire
  const todo: { icon: React.ElementType; tone: string; text: React.ReactNode; tab: AdminTab }[] = [
    ...newLeads.map((l) => ({
      icon: Inbox,
      tone: "text-primary bg-primary/10",
      text: (
        <>
          Rappeler <strong>{l.name}</strong>
          {l.offer ? ` (offre ${l.offer})` : ""}
        </>
      ),
      tab: "reservations" as const,
    })),
    ...late.map((o) => ({
      icon: AlertTriangle,
      tone: "text-red-700 bg-red-100",
      text: (
        <>
          <strong>{clientById.get(o.client_id)?.name ?? o.title}</strong> : livraison en retard ({relativeDay(o.due_date!).toLowerCase()})
        </>
      ),
      tab: "orders" as const,
    })),
    ...active
      .filter((o) => !isLate(o) && o.due_date && daysUntil(o.due_date) <= 2)
      .map((o) => ({
        icon: CalendarClock,
        tone: "text-primary bg-primary/10",
        text: (
          <>
            Livrer <strong>{clientById.get(o.client_id)?.name ?? o.title}</strong> · {relativeDay(o.due_date!).toLowerCase()}
          </>
        ),
        tab: "calendar" as const,
      })),
    ...deliveredUnpaid.map((o) => ({
      icon: Wallet,
      tone: "text-red-700 bg-red-100",
      text: (
        <>
          Encaisser le solde de <strong>{clientById.get(o.client_id)?.name}</strong> · {formatDA(balanceAmount(o))}
        </>
      ),
      tab: "clients" as const,
    })),
    ...depositsWaiting.map((o) => ({
      icon: Clock,
      tone: "text-amber-700 bg-amber-100",
      text: (
        <>
          Acompte de <strong>{clientById.get(o.client_id)?.name}</strong> à recevoir · {formatDA(depositAmount(o))}
        </>
      ),
      tab: "clients" as const,
    })),
    ...(pendingReviews.length
      ? [
          {
            icon: Star,
            tone: "text-amber-700 bg-amber-100",
            text: (
              <>
                <strong>{pendingReviews.length}</strong> avis à valider
              </>
            ),
            tab: "reviews" as const,
          },
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader title="Tableau de bord" subtitle={<span className="capitalize">{formatLongDate(today)}</span>} />

      {/* Argent */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={Wallet} tone="good" label="Encaissé ce mois" value={formatDA(paidInMonth(month))} />
        <StatTile icon={TrendingUp} label="Reste à encaisser" value={formatDA(sum(orders, remainingAmount))} hint="Acomptes + soldes non reçus" />
        <StatTile
          icon={Clock}
          tone={depositsWaiting.length ? "warning" : "good"}
          label="Acomptes en attente"
          value={formatDA(sum(depositsWaiting, depositAmount))}
          hint={`${depositsWaiting.length} projet${depositsWaiting.length > 1 ? "s" : ""} à démarrer`}
        />
        <StatTile icon={FolderKanban} label="Signé ce mois" value={formatDA(signedThisMonth)} hint="Total des projets confirmés" />
      </div>

      {/* Activité */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Inbox}
          tone={newLeads.length ? "warning" : "default"}
          label="Nouvelles réservations"
          value={newLeads.length}
          hint={`${leads.length} au total`}
        />
        <StatTile icon={Percent} label="Taux de confirmation" value={`${conversion} %`} hint="Réservations devenues projets" />
        <StatTile
          icon={FolderKanban}
          tone={late.length ? "critical" : "default"}
          label="Projets en cours"
          value={active.length}
          hint={late.length ? `${late.length} en retard` : "Aucun retard"}
        />
        <StatTile
          icon={Star}
          label="Note moyenne des avis"
          value={avgRating ? `${avgRating.toFixed(1).replace(".", ",")} / 5` : "—"}
          hint={pendingReviews.length ? `${pendingReviews.length} avis à valider` : "Aucun avis en attente"}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* À faire */}
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <BellRing className="size-5 text-primary" />
            À faire
          </h2>
          {todo.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Rien d&apos;urgent. Bon travail !</p>
          ) : (
            <ul className="mt-3 grid gap-1.5">
              {todo.slice(0, 8).map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.tab)}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-sm transition-colors hover:bg-muted/60"
                    >
                      <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", item.tone)}>
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">{item.text}</span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  </li>
                );
              })}
              {todo.length > 8 && <li className="px-2 text-xs text-muted-foreground">+ {todo.length - 8} autres</li>}
            </ul>
          )}
        </section>

        {/* Réservations par offre */}
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="font-heading text-lg font-semibold">Réservations par offre</h2>
          <HorizontalBars items={byOffer} unit="réservation" />
        </section>
      </div>

      {/* Encaissements */}
      <section className="mt-6 rounded-2xl border bg-card p-5">
        <h2 className="font-heading text-lg font-semibold">Encaissements des 6 derniers mois</h2>
        <p className="text-sm text-muted-foreground">Acomptes et soldes reçus, par mois.</p>
        <MonthlyBars months={months} />
      </section>
    </div>
  );
}

/** Histogramme vertical à une seule série, avec info-bulle au survol. */
function MonthlyBars({ months }: { months: { ym: string; label: string; long: string; value: number }[] }) {
  const [hover, setHover] = React.useState<number | null>(null);
  const max = Math.max(1, ...months.map((m) => m.value));
  const last = months.length - 1;

  return (
    <div className="mt-6">
      <div className="relative flex h-52 items-end gap-2 border-b border-foreground/15 sm:gap-4">
        {/* Ligne de repère recessive */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-foreground/10" />
        <span aria-hidden className="absolute -top-5 left-0 text-[11px] text-muted-foreground">
          {formatDA(max)}
        </span>
        {months.map((m, i) => {
          const h = (m.value / max) * 100;
          return (
            <div
              key={m.ym}
              className="relative flex h-full flex-1 cursor-default items-end justify-center"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {(hover === i || (hover === null && i === last)) && (
                <div className="absolute z-10 mb-2 rounded-lg bg-foreground px-2.5 py-1.5 text-center text-xs whitespace-nowrap text-background shadow-lg" style={{ bottom: `${h}%` }}>
                  <span className="block capitalize opacity-70">{m.long}</span>
                  <span className="font-semibold">{formatDA(m.value)}</span>
                </div>
              )}
              <div
                className={cn("w-full max-w-14 rounded-t-[4px] transition-opacity", i === last ? "bg-primary" : "bg-primary/55", hover !== null && hover !== i && "opacity-50")}
                style={{ height: `${Math.max(h, m.value ? 2 : 0)}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-4">
        {months.map((m, i) => (
          <span key={m.ym} className={cn("flex-1 text-center text-xs capitalize", i === last ? "font-semibold text-foreground" : "text-muted-foreground")}>
            {m.label}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Encaissements par mois</caption>
        <tbody>
          {months.map((m) => (
            <tr key={m.ym}>
              <th scope="row">{m.long}</th>
              <td>{formatDA(m.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Barres horizontales à une seule série. */
function HorizontalBars({ items, unit }: { items: { label: string; value: number }[]; unit: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="mt-5 grid gap-3">
      {items.map((item) => (
        <li key={item.label} className="grid grid-cols-[88px_1fr_auto] items-center gap-3 text-sm" title={`${item.label} : ${item.value} ${unit}${item.value > 1 ? "s" : ""}`}>
          <span className="truncate text-muted-foreground">{item.label}</span>
          <span className="h-3 overflow-hidden rounded-r-[4px] bg-muted">
            <span className="block h-full rounded-r-[4px] bg-primary" style={{ width: `${(item.value / max) * 100}%` }} />
          </span>
          <span className="w-6 text-right font-semibold tabular-nums">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
