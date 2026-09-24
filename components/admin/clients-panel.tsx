"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminData } from "@/components/admin/admin-data";
import { OrderDialog, PayDialog, type OrderPrefill } from "@/components/admin/order-dialog";
import { done } from "@/components/admin/shared";
import { Empty, PageHeader, PaymentStatus, Pill, StatTile, WhatsAppButton } from "@/components/admin/ui-bits";
import { formatDA } from "@/lib/format";
import {
  balanceAmount,
  balanceDue,
  depositAmount,
  depositDue,
  formatShortDate,
  orderStatusLabel,
  orderStatusStyle,
  paidAmount,
  remainingAmount,
  todayISO,
} from "@/lib/orders";
import type { Client, Order } from "@/lib/types";
import { cn } from "@/lib/utils";

type PayTarget = { order: Order; kind: "deposit" | "balance"; clientName?: string };

export function ClientsPanel({ supabase, data }: { supabase: SupabaseClient; data: AdminData }) {
  const { orders, clients, offers, clientById, reload } = data;
  const [paying, setPaying] = React.useState<PayTarget | null>(null);
  const [editingClient, setEditingClient] = React.useState<Client | "new" | null>(null);
  const [newOrder, setNewOrder] = React.useState<OrderPrefill | null>(null);
  const [search, setSearch] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null>(null);

  // ---------- Paiements en attente ----------
  const month = todayISO().slice(0, 7);
  const depositsDue = orders.filter(depositDue);
  const balancesDue = orders.filter((o) => o.deposit_paid_at && balanceDue(o));
  const lateBalances = balancesDue.filter((o) => o.status === "delivered");
  const sum = (list: Order[], fn: (o: Order) => number) => list.reduce((t, o) => t + fn(o), 0);
  const paidThisMonth = orders.reduce(
    (t, o) =>
      t +
      (o.deposit_paid_at?.startsWith(month) ? depositAmount(o) : 0) +
      (o.balance_paid_at?.startsWith(month) ? balanceAmount(o) : 0),
    0
  );

  const pending: { order: Order; kind: "deposit" | "balance"; urgent: boolean }[] = [
    ...lateBalances.map((order) => ({ order, kind: "balance" as const, urgent: true })),
    ...depositsDue.map((order) => ({ order, kind: "deposit" as const, urgent: false })),
    ...balancesDue.filter((o) => o.status !== "delivered").map((order) => ({ order, kind: "balance" as const, urgent: false })),
  ];

  // ---------- Clients ----------
  const q = search.trim().toLowerCase();
  const visibleClients = clients.filter(
    (c) => !q || [c.name, c.phone, c.email, c.company, c.city].some((v) => v?.toLowerCase().includes(q))
  );
  const ordersOf = (id: string) => orders.filter((o) => o.client_id === id);

  async function removeClient(client: Client) {
    if (!confirm(`Supprimer ${client.name} et tous ses projets ?`)) return;
    const { error } = await supabase.from("clients").delete().eq("id", client.id);
    if (await done(supabase, error, "Client supprimé.")) reload();
  }

  return (
    <div>
      <PageHeader
        title="Clients & paiements"
        subtitle="Acompte de 50 % à la commande, le reste une fois le site terminé."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditingClient("new")}>
              <UserPlus />
              Nouveau client
            </Button>
            <Button onClick={() => setNewOrder({})}>
              <Plus />
              Nouveau projet
            </Button>
          </div>
        }
      />

      {/* Résumé des paiements */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Clock}
          tone={depositsDue.length ? "warning" : "good"}
          label="Acomptes à encaisser"
          value={formatDA(sum(depositsDue, depositAmount))}
          hint={depositsDue.length ? `${depositsDue.length} client${depositsDue.length > 1 ? "s" : ""} · projet non démarré` : "Tous les acomptes sont reçus"}
        />
        <StatTile
          icon={AlertTriangle}
          tone={lateBalances.length ? "critical" : balancesDue.length ? "warning" : "good"}
          label="Soldes à encaisser"
          value={formatDA(sum(balancesDue, balanceAmount))}
          hint={
            lateBalances.length
              ? `${lateBalances.length} projet${lateBalances.length > 1 ? "s" : ""} déjà livré${lateBalances.length > 1 ? "s" : ""}`
              : `${balancesDue.length} à la fin du projet`
          }
        />
        <StatTile icon={Wallet} tone="good" label="Encaissé ce mois" value={formatDA(paidThisMonth)} />
        <StatTile
          icon={CheckCircle2}
          label="Total encaissé"
          value={formatDA(sum(orders, paidAmount))}
          hint={`Reste dû au total : ${formatDA(sum(orders, remainingAmount))}`}
        />
      </div>

      {/* Paiements en attente */}
      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold">
          <BellRing className="size-5 text-amber-600" />
          Paiements en attente
          <span className="text-sm font-normal text-muted-foreground">({pending.length})</span>
        </h2>
        {pending.length === 0 ? (
          <Empty>Aucun paiement en attente. Tout est encaissé 🎉</Empty>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-card">
            {pending.map(({ order, kind, urgent }) => {
              const client = clientById.get(order.client_id);
              const amount = kind === "deposit" ? depositAmount(order) : balanceAmount(order);
              const what = kind === "deposit" ? `l'acompte de ${formatDA(amount)} pour démarrer` : `le solde de ${formatDA(amount)}`;
              return (
                <div
                  key={`${order.id}-${kind}`}
                  className={cn("grid gap-3 border-b p-4 last:border-b-0 md:grid-cols-[1.2fr_1fr_auto] md:items-center", urgent && "bg-red-50/40")}
                >
                  <div className="min-w-0">
                    <p className="font-semibold">{client?.name ?? "Client supprimé"}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {order.title}
                      {order.offer ? ` · ${order.offer}` : ""} · total {formatDA(order.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {kind === "deposit"
                        ? `Acompte ${order.deposit_percent} % · réservé le ${formatShortDate(order.created_at)}`
                        : order.status === "delivered"
                          ? `Solde · livré le ${formatShortDate(order.delivered_at ?? order.due_date ?? todayISO())}`
                          : `Solde · une fois terminé${order.due_date ? ` (${formatShortDate(order.due_date)})` : ""}`}
                    </p>
                  </div>
                  <PaymentStatus
                    label={kind === "deposit" ? "Acompte" : "Solde"}
                    amount={amount}
                    paidAt={null}
                    late={urgent}
                    onPay={() => setPaying({ order, kind, clientName: client?.name })}
                  />
                  <div className="flex gap-2 md:justify-end">
                    {client && (
                      <WhatsAppButton
                        phone={client.phone}
                        label="Relancer"
                        text={`Bonjour ${client.name}, c'est NUVEX. Petit rappel pour ${what} (${order.title}). Merci !`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Fiches clients */}
      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold">
            Clients <span className="text-sm font-normal text-muted-foreground">({clients.length})</span>
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un client…" className="h-10 pl-9" />
          </div>
        </div>

        {visibleClients.length === 0 && <Empty>Aucun client trouvé.</Empty>}
        <div className="grid gap-3">
          {visibleClients.map((client) => {
            const list = ordersOf(client.id);
            const total = sum(list.filter((o) => o.status !== "cancelled"), (o) => o.price);
            const rest = sum(list, remainingAmount);
            const open = openId === client.id;

            return (
              <div key={client.id} className="overflow-hidden rounded-2xl border bg-card">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : client.id)}
                  className="grid w-full gap-2 p-4 text-left sm:grid-cols-[1.4fr_1fr_auto] sm:items-center"
                  aria-expanded={open}
                >
                  <div className="min-w-0">
                    <p className="font-semibold">{client.name}</p>
                    <p className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                      {client.company && <span>{client.company}</span>}
                      {client.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {client.city}
                        </span>
                      )}
                      <span>
                        {list.length} projet{list.length > 1 ? "s" : ""}
                      </span>
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total </span>
                    <strong>{formatDA(total)}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    {rest > 0 ? (
                      <Pill className="bg-amber-100 text-amber-900">
                        <Clock className="size-3" />
                        Reste {formatDA(rest)}
                      </Pill>
                    ) : (
                      <Pill className="bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="size-3" />
                        À jour
                      </Pill>
                    )}
                    <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
                  </div>
                </button>

                {open && (
                  <div className="border-t bg-muted/30 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {client.phone && (
                        <a href={`tel:${client.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1">
                          <Phone className="size-3.5" />
                          {client.phone}
                        </a>
                      )}
                      {client.email && (
                        <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1 break-all">
                          <Mail className="size-3.5" />
                          {client.email}
                        </a>
                      )}
                      <WhatsAppButton phone={client.phone} />
                      <div className="ml-auto flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setNewOrder({ client_id: client.id })}>
                          <Plus />
                          Projet
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingClient(client)}>
                          <Pencil />
                          Modifier
                        </Button>
                        <Button size="icon-sm" variant="ghost" onClick={() => removeClient(client)} aria-label="Supprimer le client">
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                    {client.notes && <p className="mt-3 text-sm text-muted-foreground">📝 {client.notes}</p>}

                    <div className="mt-4 grid gap-3">
                      {list.length === 0 && <p className="text-sm text-muted-foreground">Aucun projet pour ce client.</p>}
                      {list.map((order) => (
                        <div key={order.id} className="rounded-xl border bg-card p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold">
                              {order.title} · {formatDA(order.price)}
                            </p>
                            <Pill className={orderStatusStyle[order.status]}>{orderStatusLabel[order.status]}</Pill>
                          </div>
                          {order.status !== "cancelled" && order.price > 0 && (
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              <PaymentStatus
                                compact
                                label="Acompte"
                                amount={depositAmount(order)}
                                paidAt={order.deposit_paid_at}
                                method={order.deposit_method}
                                onPay={() => setPaying({ order, kind: "deposit", clientName: client.name })}
                              />
                              {balanceAmount(order) > 0 && (
                                <PaymentStatus
                                  compact
                                  label="Solde"
                                  amount={balanceAmount(order)}
                                  paidAt={order.balance_paid_at}
                                  method={order.balance_method}
                                  late={order.status === "delivered"}
                                  onPay={() => setPaying({ order, kind: "balance", clientName: client.name })}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <PayDialog
        supabase={supabase}
        target={paying}
        onClose={() => setPaying(null)}
        onSaved={() => {
          setPaying(null);
          reload();
        }}
      />
      <OrderDialog
        supabase={supabase}
        open={newOrder !== null}
        prefill={newOrder}
        clients={clients}
        offers={offers}
        onClose={() => setNewOrder(null)}
        onSaved={() => {
          setNewOrder(null);
          reload();
        }}
      />
      <ClientDialog
        supabase={supabase}
        client={editingClient}
        onClose={() => setEditingClient(null)}
        onSaved={() => {
          setEditingClient(null);
          reload();
        }}
      />
    </div>
  );
}

function ClientDialog({
  supabase,
  client,
  onClose,
  onSaved,
}: {
  supabase: SupabaseClient;
  client: Client | "new" | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const current = client && client !== "new" ? client : null;
  const [saving, setSaving] = React.useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim() || null;
    const values = { name: text("name") ?? "", phone: text("phone") ?? "", email: text("email"), company: text("company"), city: text("city"), notes: text("notes") };
    setSaving(true);
    const { error } = current
      ? await supabase.from("clients").update(values).eq("id", current.id)
      : await supabase.from("clients").insert({ ...values, id: crypto.randomUUID() });
    setSaving(false);
    if (await done(supabase, error, current ? "Client modifié." : "Client ajouté.")) onSaved();
  }

  return (
    <Dialog open={client !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold">{current ? `Modifier ${current.name}` : "Nouveau client"}</DialogTitle>
        </DialogHeader>
        <form key={current?.id ?? "new"} onSubmit={submit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="cl-name">Nom *</Label>
            <Input id="cl-name" name="name" required defaultValue={current?.name} className="h-10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="cl-phone">Téléphone</Label>
              <Input id="cl-phone" name="phone" type="tel" defaultValue={current?.phone} className="h-10" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cl-city">Ville</Label>
              <Input id="cl-city" name="city" defaultValue={current?.city ?? ""} className="h-10" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cl-email">E-mail</Label>
            <Input id="cl-email" name="email" type="email" defaultValue={current?.email ?? ""} className="h-10" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cl-company">Entreprise / activité</Label>
            <Input id="cl-company" name="company" defaultValue={current?.company ?? ""} className="h-10" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cl-notes">Notes</Label>
            <Textarea id="cl-notes" name="notes" rows={2} defaultValue={current?.notes ?? ""} />
          </div>
          <Button type="submit" disabled={saving} className="mt-1 h-10">
            Enregistrer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
