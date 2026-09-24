"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AlertTriangle, ChevronLeft, ChevronRight, PackageCheck, Play, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminData } from "@/components/admin/admin-data";
import { OrderDialog } from "@/components/admin/order-dialog";
import { Empty, PageHeader } from "@/components/admin/ui-bits";
import { formatDA } from "@/lib/format";
import { formatLongDate, isLate, relativeDay, remainingAmount, toISODate, todayISO } from "@/lib/orders";
import type { Order } from "@/lib/types";
import { cn } from "@/lib/utils";

type EventKind = "delivery" | "late" | "delivered" | "start";
interface CalEvent {
  date: string;
  kind: EventKind;
  order: Order;
  label: string;
}

const kindStyle: Record<EventKind, { chip: string; dot: string; icon: React.ElementType; text: string }> = {
  delivery: { chip: "bg-primary/10 text-primary", dot: "bg-primary", icon: Truck, text: "Livraison" },
  late: { chip: "bg-red-100 text-red-800", dot: "bg-red-500", icon: AlertTriangle, text: "En retard" },
  delivered: { chip: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500", icon: PackageCheck, text: "Livré" },
  start: { chip: "bg-slate-100 text-slate-700", dot: "bg-slate-400", icon: Play, text: "Début" },
};

const monthFormat = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function CalendarPanel({ supabase, data }: { supabase: SupabaseClient; data: AdminData }) {
  const { orders, clients, offers, clientById, reload } = data;
  const today = todayISO();
  const [cursor, setCursor] = React.useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = React.useState(today);
  const [editing, setEditing] = React.useState<Order | null>(null);

  // Tous les événements, par date.
  const events = React.useMemo(() => {
    const list: CalEvent[] = [];
    for (const order of orders) {
      if (order.status === "cancelled") continue;
      const name = clientById.get(order.client_id)?.name ?? order.title;
      if (order.status === "delivered") {
        const date = order.delivered_at ?? order.due_date;
        if (date) list.push({ date, kind: "delivered", order, label: name });
      } else if (order.due_date) {
        list.push({ date: order.due_date, kind: isLate(order) ? "late" : "delivery", order, label: name });
      }
      if (order.start_date && order.status !== "delivered") list.push({ date: order.start_date, kind: "start", order, label: name });
    }
    const byDate = new Map<string, CalEvent[]>();
    for (const e of list) byDate.set(e.date, [...(byDate.get(e.date) ?? []), e]);
    return byDate;
  }, [orders, clientById]);

  // Grille du mois (semaines du lundi au dimanche).
  const days = React.useMemo(() => {
    const first = new Date(cursor);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return { iso: toISODate(d), day: d.getDate(), inMonth: d.getMonth() === cursor.getMonth() };
    });
  }, [cursor]);

  const upcoming = orders
    .filter((o) => (o.status === "todo" || o.status === "in_progress") && o.due_date)
    .sort((a, b) => a.due_date!.localeCompare(b.due_date!));

  const move = (months: number) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + months, 1));
  const selectedEvents = events.get(selected) ?? [];

  return (
    <div>
      <PageHeader title="Calendrier" subtitle="Livraisons prévues, retards et démarrages de projets." />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border bg-card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-heading text-xl font-semibold capitalize">{monthFormat.format(cursor)}</h2>
            <div className="flex items-center gap-1">
              <Button size="icon-sm" variant="outline" onClick={() => move(-1)} aria-label="Mois précédent">
                <ChevronLeft />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const d = new Date();
                  setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
                  setSelected(today);
                }}
              >
                Aujourd&apos;hui
              </Button>
              <Button size="icon-sm" variant="outline" onClick={() => move(1)} aria-label="Mois suivant">
                <ChevronRight />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border text-sm">
            {weekDays.map((d) => (
              <div key={d} className="bg-muted/60 py-2 text-center text-xs font-semibold text-muted-foreground">
                {d}
              </div>
            ))}
            {days.map(({ iso, day, inMonth }) => {
              const dayEvents = events.get(iso) ?? [];
              const isToday = iso === today;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  className={cn(
                    "flex min-h-16 flex-col gap-1 bg-card p-1.5 text-left transition-colors hover:bg-muted/50 sm:min-h-24",
                    !inMonth && "bg-muted/30 text-muted-foreground/60",
                    selected === iso && "ring-2 ring-primary ring-inset"
                  )}
                  aria-label={`${formatLongDate(iso)}${dayEvents.length ? `, ${dayEvents.length} événement(s)` : ""}`}
                >
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full text-xs font-semibold",
                      isToday && "bg-primary text-primary-foreground"
                    )}
                  >
                    {day}
                  </span>
                  {/* Mobile : des points ; ordinateur : des étiquettes */}
                  <span className="flex flex-wrap gap-0.5 sm:hidden">
                    {dayEvents.map((e, i) => (
                      <span key={i} className={cn("size-1.5 rounded-full", kindStyle[e.kind].dot)} />
                    ))}
                  </span>
                  <span className="hidden flex-col gap-0.5 sm:flex">
                    {dayEvents.slice(0, 3).map((e, i) => {
                      const Icon = kindStyle[e.kind].icon;
                      return (
                        <span key={i} className={cn("flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] font-semibold", kindStyle[e.kind].chip)}>
                          <Icon className="size-2.5 shrink-0" />
                          <span className="truncate">{e.label}</span>
                        </span>
                      );
                    })}
                    {dayEvents.length > 3 && <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Légende */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {(Object.keys(kindStyle) as EventKind[]).map((k) => {
              const Icon = kindStyle[k].icon;
              return (
                <span key={k} className="flex items-center gap-1">
                  <span className={cn("grid size-4 place-items-center rounded", kindStyle[k].chip)}>
                    <Icon className="size-2.5" />
                  </span>
                  {kindStyle[k].text}
                </span>
              );
            })}
          </div>

          {/* Détail du jour sélectionné */}
          <div className="mt-5 border-t pt-4">
            <h3 className="font-semibold capitalize">{formatLongDate(selected)}</h3>
            {selectedEvents.length === 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">Rien de prévu ce jour-là.</p>
            ) : (
              <ul className="mt-2 grid gap-2">
                {selectedEvents.map((e, i) => (
                  <EventRow key={i} event={e} onOpen={() => setEditing(e.order)} />
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Prochaines livraisons */}
        <aside className="rounded-2xl border bg-card p-5">
          <h2 className="font-heading text-lg font-semibold">Prochaines livraisons</h2>
          {upcoming.length === 0 ? (
            <div className="mt-3">
              <Empty>Aucune livraison prévue.</Empty>
            </div>
          ) : (
            <ul className="mt-3 grid gap-2">
              {upcoming.map((order) => {
                const late = isLate(order);
                const client = clientById.get(order.client_id);
                const rest = remainingAmount(order);
                return (
                  <li key={order.id}>
                    <button
                      type="button"
                      onClick={() => setEditing(order)}
                      className={cn("w-full rounded-xl border p-3 text-left transition-colors hover:bg-muted/50", late && "border-red-200 bg-red-50/50")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{client?.name ?? order.title}</p>
                        <span className={cn("shrink-0 text-xs font-semibold", late ? "text-red-700" : "text-primary")}>
                          {late ? `⚠ ${relativeDay(order.due_date!).replace("Il y a", "Retard")}` : relativeDay(order.due_date!)}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{order.title}</p>
                      {rest > 0 && <p className="mt-1 text-xs text-muted-foreground">Reste à encaisser : {formatDA(rest)}</p>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>

      <OrderDialog
        supabase={supabase}
        open={editing !== null}
        order={editing}
        clients={clients}
        offers={offers}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          reload();
        }}
      />
    </div>
  );
}

function EventRow({ event, onOpen }: { event: CalEvent; onOpen: () => void }) {
  const style = kindStyle[event.kind];
  const Icon = style.icon;
  return (
    <li>
      <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 rounded-xl border p-3 text-left hover:bg-muted/50">
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", style.chip)}>
          <Icon className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">
            {style.text} · {event.label}
          </span>
          <span className="block truncate text-xs text-muted-foreground">{event.order.title}</span>
        </span>
      </button>
    </li>
  );
}
