"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CalendarClock, PackageCheck, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminData } from "@/components/admin/admin-data";
import { OrderDialog, PayDialog } from "@/components/admin/order-dialog";
import { done } from "@/components/admin/shared";
import { Empty, PageHeader, PaymentStatus, Pill, WhatsAppButton } from "@/components/admin/ui-bits";
import { formatDA } from "@/lib/format";
import {
  balanceAmount,
  daysUntil,
  depositAmount,
  formatShortDate,
  isLate,
  orderStatusLabel,
  orderStatusStyle,
  parseISODate,
  todayISO,
} from "@/lib/orders";
import type { Order } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "active" | "late" | "delivered" | "cancelled" | "all";

export function OrdersPanel({ supabase, data }: { supabase: SupabaseClient; data: AdminData }) {
  const { orders, clients, offers, clientById, reload } = data;
  const [filter, setFilter] = React.useState<Filter>("active");
  const [editing, setEditing] = React.useState<Order | "new" | null>(null);
  const [paying, setPaying] = React.useState<{ order: Order; kind: "deposit" | "balance"; clientName?: string } | null>(null);

  const active = orders.filter((o) => o.status === "todo" || o.status === "in_progress");
  const lists: Record<Filter, Order[]> = {
    active: [...active].sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999")),
    late: active.filter(isLate),
    delivered: orders.filter((o) => o.status === "delivered"),
    cancelled: orders.filter((o) => o.status === "cancelled"),
    all: orders,
  };
  const filters: { id: Filter; label: string }[] = [
    { id: "active", label: "En cours" },
    { id: "late", label: "En retard" },
    { id: "delivered", label: "Livrés" },
    { id: "cancelled", label: "Annulés" },
    { id: "all", label: "Tous" },
  ];

  async function markDelivered(order: Order) {
    const { error } = await supabase.from("orders").update({ status: "delivered", delivered_at: todayISO() }).eq("id", order.id);
    if (await done(supabase, error, "Projet marqué comme livré. Pensez à encaisser le solde.")) reload();
  }

  async function remove(order: Order) {
    if (!confirm(`Supprimer le projet « ${order.title} » ?`)) return;
    const { error } = await supabase.from("orders").delete().eq("id", order.id);
    if (await done(supabase, error, "Projet supprimé.")) reload();
  }

  return (
    <div>
      <PageHeader
        title="Projets clients"
        subtitle={`${active.length} projet${active.length > 1 ? "s" : ""} en cours${lists.late.length ? ` · ${lists.late.length} en retard` : ""}`}
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus />
            Nouveau projet
          </Button>
        }
      />

      <div className="mb-5 flex gap-1 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium",
              filter === f.id ? "border-foreground bg-foreground text-background" : "bg-background",
              f.id === "late" && lists.late.length > 0 && filter !== f.id && "border-red-300 text-red-700"
            )}
          >
            {f.label}
            <span className="text-xs opacity-60">{lists[f.id].length}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {lists[filter].length === 0 && <Empty>Aucun projet ici.</Empty>}
        {lists[filter].map((order) => {
          const client = clientById.get(order.client_id);
          const late = isLate(order);
          const days = order.due_date ? daysUntil(order.due_date) : null;
          const progress =
            order.start_date && order.due_date
              ? Math.min(
                  100,
                  Math.max(
                    0,
                    ((parseISODate(todayISO()).getTime() - parseISODate(order.start_date).getTime()) /
                      Math.max(1, parseISODate(order.due_date).getTime() - parseISODate(order.start_date).getTime())) *
                      100
                  )
                )
              : null;

          return (
            <article key={order.id} className={cn("flex flex-col rounded-2xl border bg-card p-5", late && "ring-2 ring-red-300")}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold">{order.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {client?.name ?? "Client supprimé"}
                    {order.offer ? ` · Offre ${order.offer}` : ""} · {formatDA(order.price)}
                  </p>
                </div>
                <Pill className={orderStatusStyle[order.status]}>{orderStatusLabel[order.status]}</Pill>
              </div>

              {/* Livraison */}
              {order.status === "delivered" ? (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-700">
                  <PackageCheck className="size-4" />
                  Livré le {formatShortDate(order.delivered_at ?? order.due_date ?? todayISO())}
                </p>
              ) : (
                order.due_date &&
                order.status !== "cancelled" && (
                  <div className="mt-3">
                    <p className={cn("flex items-center gap-1.5 text-sm font-medium", late ? "text-red-700" : "text-foreground")}>
                      <CalendarClock className="size-4" />
                      Livraison le {formatShortDate(order.due_date)} ·{" "}
                      {late ? `en retard de ${-days!} j` : days === 0 ? "aujourd'hui" : `dans ${days} j`}
                    </p>
                    {progress !== null && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                        <div className={cn("h-full rounded-full", late ? "bg-red-500" : "bg-primary")} style={{ width: `${progress}%` }} />
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Paiements */}
              {order.status !== "cancelled" && order.price > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <PaymentStatus
                    compact
                    label="Acompte"
                    amount={depositAmount(order)}
                    paidAt={order.deposit_paid_at}
                    method={order.deposit_method}
                    onPay={() => setPaying({ order, kind: "deposit", clientName: client?.name })}
                  />
                  {balanceAmount(order) > 0 && (
                    <PaymentStatus
                      compact
                      label="Solde"
                      amount={balanceAmount(order)}
                      paidAt={order.balance_paid_at}
                      method={order.balance_method}
                      late={order.status === "delivered"}
                      onPay={() => setPaying({ order, kind: "balance", clientName: client?.name })}
                    />
                  )}
                </div>
              )}

              {order.notes && <p className="mt-3 text-sm text-muted-foreground">{order.notes}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
                {client && <WhatsAppButton phone={client.phone} text={`Bonjour ${client.name}, c'est NUVEX à propos de votre site.`} />}
                {(order.status === "todo" || order.status === "in_progress") && (
                  <Button size="sm" variant="outline" onClick={() => markDelivered(order)}>
                    <PackageCheck />
                    Marquer livré
                  </Button>
                )}
                <div className="ml-auto flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setEditing(order)}>
                    <Pencil />
                    Modifier
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => remove(order)} aria-label="Supprimer" title="Supprimer">
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <OrderDialog
        supabase={supabase}
        open={editing !== null}
        order={editing === "new" ? null : editing}
        clients={clients}
        offers={offers}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          reload();
        }}
      />
      <PayDialog
        supabase={supabase}
        target={paying}
        onClose={() => setPaying(null)}
        onSaved={() => {
          setPaying(null);
          reload();
        }}
      />
    </div>
  );
}
