"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { done, fieldClass } from "@/components/admin/shared";
import { formatDA } from "@/lib/format";
import {
  DEFAULT_DELIVERY_DAYS,
  DEFAULT_DEPOSIT_PERCENT,
  addDays,
  balanceAmount,
  depositAmount,
  orderStatusLabel,
  paymentMethodLabel,
  todayISO,
} from "@/lib/orders";
import type { Client, Offer, Order, OrderStatus, PaymentMethod } from "@/lib/types";

const NEW_CLIENT = "__new__";
const digits = (s: string) => s.replace(/\D/g, "");

/** Données pour pré-remplir un nouveau projet (ex. à partir d'une réservation). */
export interface OrderPrefill {
  name?: string;
  phone?: string;
  email?: string | null;
  offer?: string | null;
  lead_id?: string;
  client_id?: string;
  notes?: string | null;
}

export function OrderDialog({
  supabase,
  open,
  order,
  prefill,
  clients,
  offers,
  onClose,
  onSaved,
}: {
  supabase: SupabaseClient;
  open: boolean;
  order?: Order | null;
  prefill?: OrderPrefill | null;
  clients: Client[];
  offers: Offer[];
  onClose: () => void;
  onSaved: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold">
            {order ? `Modifier « ${order.title} »` : prefill?.lead_id ? "Confirmer la réservation" : "Nouveau projet client"}
          </DialogTitle>
        </DialogHeader>
        {open && (
          <OrderForm
            key={order?.id ?? prefill?.lead_id ?? "new"}
            supabase={supabase}
            order={order ?? null}
            prefill={prefill ?? null}
            clients={clients}
            offers={offers}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function OrderForm({
  supabase,
  order,
  prefill,
  clients,
  offers,
  onSaved,
}: {
  supabase: SupabaseClient;
  order: Order | null;
  prefill: OrderPrefill | null;
  clients: Client[];
  offers: Offer[];
  onSaved: () => void;
}) {
  const today = todayISO();
  const offerByName = (name?: string | null) => offers.find((o) => o.name === name);

  // Client existant retrouvé par son numéro, sinon nouveau client pré-rempli.
  const matchedClient =
    prefill?.client_id ?? (prefill?.phone ? clients.find((c) => digits(c.phone) === digits(prefill.phone!))?.id : undefined);
  const initialOffer = order?.offer ?? prefill?.offer ?? "";
  const initialPrice = order?.price ?? offerByName(initialOffer)?.price ?? 0;
  const fixedDelivery = (offerName: string) => offerByName(offerName)?.price != null;

  const [clientId, setClientId] = React.useState<string>(order?.client_id ?? matchedClient ?? (clients.length && !prefill ? clients[0].id : NEW_CLIENT));
  const [newClient, setNewClient] = React.useState({
    name: prefill?.name ?? "",
    phone: prefill?.phone ?? "",
    email: prefill?.email ?? "",
    city: "",
  });
  const [form, setForm] = React.useState({
    title: order?.title ?? (initialOffer ? `Site web — offre ${initialOffer}` : "Site web"),
    offer: initialOffer,
    price: String(initialPrice || ""),
    deposit_percent: String(order?.deposit_percent ?? DEFAULT_DEPOSIT_PERCENT),
    start_date: order?.start_date ?? today,
    due_date: order?.due_date ?? (fixedDelivery(initialOffer) || !initialOffer ? addDays(today, DEFAULT_DELIVERY_DAYS) : ""),
    status: (order?.status ?? "todo") as OrderStatus,
    notes: order?.notes ?? prefill?.notes ?? "",
    deposit_paid: Boolean(order?.deposit_paid_at),
    deposit_paid_at: order?.deposit_paid_at ?? today,
    deposit_method: (order?.deposit_method ?? "especes") as PaymentMethod,
    balance_paid: Boolean(order?.balance_paid_at),
    balance_paid_at: order?.balance_paid_at ?? today,
    balance_method: (order?.balance_method ?? "especes") as PaymentMethod,
  });
  const [saving, setSaving] = React.useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  function changeOffer(name: string) {
    const offer = offerByName(name);
    setForm((f) => ({
      ...f,
      offer: name,
      price: offer?.price != null ? String(offer.price) : f.price,
      title: f.title.startsWith("Site web") ? `Site web — offre ${name}` : f.title,
      due_date: offer?.price != null ? addDays(f.start_date || today, DEFAULT_DELIVERY_DAYS) : f.due_date,
    }));
  }

  const price = Number(form.price) || 0;
  const percent = Math.min(100, Math.max(0, Number(form.deposit_percent) || 0));
  const amounts = { price, deposit_percent: percent };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    let client_id = clientId;
    if (clientId === NEW_CLIENT) {
      if (!newClient.name.trim()) {
        setSaving(false);
        toast.error("Indiquez le nom du client.");
        return;
      }
      client_id = crypto.randomUUID();
      const { error } = await supabase.from("clients").insert({
        id: client_id,
        name: newClient.name.trim(),
        phone: newClient.phone.trim(),
        email: newClient.email?.trim() || null,
        city: newClient.city.trim() || null,
      });
      if (error) {
        setSaving(false);
        toast.error(`Erreur : ${error.message}`);
        return;
      }
    }

    const values = {
      client_id,
      title: form.title.trim() || "Site web",
      offer: form.offer || null,
      price,
      deposit_percent: percent,
      start_date: form.start_date || null,
      due_date: form.due_date || null,
      status: form.status,
      delivered_at: form.status === "delivered" ? (order?.delivered_at ?? today) : null,
      notes: form.notes.trim() || null,
      deposit_paid_at: form.deposit_paid ? form.deposit_paid_at : null,
      deposit_method: form.deposit_paid ? form.deposit_method : null,
      balance_paid_at: form.balance_paid ? form.balance_paid_at : null,
      balance_method: form.balance_paid ? form.balance_method : null,
    };

    const { error } = order
      ? await supabase.from("orders").update(values).eq("id", order.id)
      : await supabase.from("orders").insert({ ...values, id: crypto.randomUUID(), lead_id: prefill?.lead_id ?? null });

    if (!error && prefill?.lead_id) {
      await supabase.from("leads").update({ status: "converted" }).eq("id", prefill.lead_id);
    }

    setSaving(false);
    if (await done(supabase, error, order ? "Projet mis à jour." : "Projet client créé.")) onSaved();
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      {/* Client */}
      <fieldset className="grid gap-3 rounded-xl border p-4">
        <legend className="px-1 text-sm font-semibold">Client</legend>
        <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={fieldClass} aria-label="Client">
          <option value={NEW_CLIENT}>+ Nouveau client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.phone ? `· ${c.phone}` : ""}
            </option>
          ))}
        </select>
        {clientId === NEW_CLIENT && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="c-name">Nom *</Label>
              <Input id="c-name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="h-10" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="c-phone">Téléphone</Label>
              <Input id="c-phone" type="tel" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} className="h-10" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="c-email">E-mail</Label>
              <Input id="c-email" type="email" value={newClient.email ?? ""} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} className="h-10" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="c-city">Ville</Label>
              <Input id="c-city" value={newClient.city} onChange={(e) => setNewClient({ ...newClient, city: e.target.value })} className="h-10" />
            </div>
          </div>
        )}
      </fieldset>

      {/* Projet */}
      <fieldset className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold">Projet</legend>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="o-title">Nom du projet</Label>
          <Input id="o-title" value={form.title} onChange={(e) => set("title", e.target.value)} className="h-10" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="o-offer">Offre</Label>
          <select id="o-offer" value={form.offer} onChange={(e) => changeOffer(e.target.value)} className={fieldClass}>
            <option value="">—</option>
            {offers.map((o) => (
              <option key={o.id} value={o.name}>
                {o.name}
                {o.price != null ? ` · ${formatDA(o.price)}` : " · sur devis"}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="o-status">Statut</Label>
          <select id="o-status" value={form.status} onChange={(e) => set("status", e.target.value as OrderStatus)} className={fieldClass}>
            {(Object.keys(orderStatusLabel) as OrderStatus[]).map((s) => (
              <option key={s} value={s}>
                {orderStatusLabel[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="o-start">Date de début</Label>
          <Input id="o-start" type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className="h-10" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="o-due">Date de livraison prévue</Label>
          <Input id="o-due" type="date" value={form.due_date} onChange={(e) => set("due_date", e.target.value)} className="h-10" />
        </div>
      </fieldset>

      {/* Paiement */}
      <fieldset className="grid gap-4 rounded-xl border p-4">
        <legend className="px-1 text-sm font-semibold">Paiement</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="o-price">Prix total (DA)</Label>
            <Input id="o-price" type="number" min={0} step={500} value={form.price} onChange={(e) => set("price", e.target.value)} className="h-10" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="o-percent">Acompte (%)</Label>
            <Input id="o-percent" type="number" min={0} max={100} value={form.deposit_percent} onChange={(e) => set("deposit_percent", e.target.value)} className="h-10" />
          </div>
        </div>
        <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
          Acompte à la commande : <strong>{formatDA(depositAmount(amounts))}</strong> · Solde à la livraison :{" "}
          <strong>{formatDA(balanceAmount(amounts))}</strong>
        </p>

        <PaymentRow
          label={`Acompte reçu (${formatDA(depositAmount(amounts))})`}
          paid={form.deposit_paid}
          date={form.deposit_paid_at}
          method={form.deposit_method}
          onPaid={(v) => set("deposit_paid", v)}
          onDate={(v) => set("deposit_paid_at", v)}
          onMethod={(v) => set("deposit_method", v)}
        />
        <PaymentRow
          label={`Solde reçu (${formatDA(balanceAmount(amounts))})`}
          paid={form.balance_paid}
          date={form.balance_paid_at}
          method={form.balance_method}
          onPaid={(v) => set("balance_paid", v)}
          onDate={(v) => set("balance_paid_at", v)}
          onMethod={(v) => set("balance_method", v)}
        />
      </fieldset>

      <div className="grid gap-1.5">
        <Label htmlFor="o-notes">Notes</Label>
        <Textarea id="o-notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Contenus reçus, remarques du client…" />
      </div>

      <Button type="submit" disabled={saving} className="h-11">
        {saving ? <Loader2 className="animate-spin" /> : <Save />}
        Enregistrer
      </Button>
    </form>
  );
}

function PaymentRow({
  label,
  paid,
  date,
  method,
  onPaid,
  onDate,
  onMethod,
}: {
  label: string;
  paid: boolean;
  date: string;
  method: PaymentMethod;
  onPaid: (v: boolean) => void;
  onDate: (v: string) => void;
  onMethod: (v: PaymentMethod) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={paid} onChange={(e) => onPaid(e.target.checked)} className="size-4 accent-emerald-600" />
        {label}
      </label>
      {paid && (
        <>
          <Input type="date" value={date} onChange={(e) => onDate(e.target.value)} className="h-9" aria-label="Date du paiement" />
          <select value={method} onChange={(e) => onMethod(e.target.value as PaymentMethod)} className={`${fieldClass} h-9`} aria-label="Moyen de paiement">
            {(Object.keys(paymentMethodLabel) as PaymentMethod[]).map((m) => (
              <option key={m} value={m}>
                {paymentMethodLabel[m]}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}

/** Petite fenêtre pour enregistrer un paiement (acompte ou solde) en 2 clics. */
export function PayDialog({
  supabase,
  target,
  onClose,
  onSaved,
}: {
  supabase: SupabaseClient;
  target: { order: Order; kind: "deposit" | "balance"; clientName?: string } | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [date, setDate] = React.useState(todayISO());
  const [method, setMethod] = React.useState<PaymentMethod>("especes");
  const [saving, setSaving] = React.useState(false);

  if (!target) return null;
  const { order, kind } = target;
  const amount = kind === "deposit" ? depositAmount(order) : balanceAmount(order);
  const label = kind === "deposit" ? "l'acompte" : "le solde";

  async function confirm() {
    setSaving(true);
    const values =
      kind === "deposit"
        ? { deposit_paid_at: date, deposit_method: method, status: order.status === "todo" ? "in_progress" : order.status }
        : { balance_paid_at: date, balance_method: method };
    const { error } = await supabase.from("orders").update(values).eq("id", order.id);
    setSaving(false);
    if (await done(supabase, error, `Paiement de ${formatDA(amount)} enregistré.`)) onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="p-6 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold">Encaisser {label}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {target.clientName ? `${target.clientName} · ` : ""}
          {order.title}
        </p>
        <p className="font-heading text-3xl font-bold">{formatDA(amount)}</p>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="pay-date">Date du paiement</Label>
            <Input id="pay-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pay-method">Moyen de paiement</Label>
            <select id="pay-method" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} className={fieldClass}>
              {(Object.keys(paymentMethodLabel) as PaymentMethod[]).map((m) => (
                <option key={m} value={m}>
                  {paymentMethodLabel[m]}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={confirm} disabled={saving} className="h-11 bg-emerald-600 hover:bg-emerald-700">
            {saving && <Loader2 className="animate-spin" />}
            Confirmer le paiement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
