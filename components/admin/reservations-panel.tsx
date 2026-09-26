"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CheckCircle2, Mail, Phone, PhoneCall, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminData } from "@/components/admin/admin-data";
import { OrderDialog, type OrderPrefill } from "@/components/admin/order-dialog";
import { dateFormatter, done } from "@/components/admin/shared";
import { Empty, PageHeader, Pill, WhatsAppButton } from "@/components/admin/ui-bits";
import { formatDA } from "@/lib/format";
import { leadStatusLabel, leadStatusStyle } from "@/lib/orders";
import { leadKind, leadKindLabel, leadKindStyle, subscriptionPrice, type LeadKind } from "@/lib/lead-kind";
import type { Lead, LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const kinds: { id: LeadKind | "all"; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "order", label: "Commandes" },
  { id: "quote", label: "Devis" },
  { id: "subscription", label: "Abonnements" },
  { id: "service", label: "Services" },
];

const filters: { id: LeadStatus | "all"; label: string }[] = [
  { id: "new", label: "Nouvelles" },
  { id: "contacted", label: "Contactées" },
  { id: "converted", label: "Confirmées" },
  { id: "cancelled", label: "Annulées" },
  { id: "all", label: "Toutes" },
];

export function ReservationsPanel({
  supabase,
  data,
  onOpenProjects,
}: {
  supabase: SupabaseClient;
  data: AdminData;
  onOpenProjects: () => void;
}) {
  const { leads, offers, clients, reload } = data;
  const [filter, setFilter] = React.useState<LeadStatus | "all">(() => (leads.some((l) => l.status === "new") ? "new" : "all"));
  const [converting, setConverting] = React.useState<OrderPrefill | null>(null);
  const [kind, setKind] = React.useState<LeadKind | "all">("all");

  const ofKind = kind === "all" ? leads : leads.filter((l) => leadKind(l.offer) === kind);
  const count = (s: LeadStatus) => ofKind.filter((l) => l.status === s).length;
  const countKind = (k: LeadKind) => leads.filter((l) => leadKind(l.offer) === k).length;
  const visible = filter === "all" ? ofKind : ofKind.filter((l) => l.status === filter);
  const priceOf = (offer: string | null) => offers.find((o) => o.name === offer)?.price;

  async function setStatus(lead: Lead, status: LeadStatus) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", lead.id);
    if (await done(supabase, error, `Réservation ${leadStatusLabel[status].toLowerCase()}.`)) reload();
  }

  async function remove(lead: Lead) {
    if (!confirm(`Supprimer définitivement la réservation de ${lead.name} ?`)) return;
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    if (await done(supabase, error, "Réservation supprimée.")) reload();
  }

  return (
    <div>
      <PageHeader
        title="Réservations"
        subtitle={
          count("new") > 0
            ? `${count("new")} nouvelle${count("new") > 1 ? "s" : ""} réservation${count("new") > 1 ? "s" : ""} à rappeler.`
            : "Toutes les réservations ont été traitées."
        }
      />

      {/* Type de demande */}
      <div className="mb-3 flex gap-1.5 overflow-x-auto">
        {kinds.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setKind(k.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors",
              kind === k.id
                ? k.id === "all"
                  ? "bg-primary text-primary-foreground"
                  : cn(leadKindStyle[k.id], "ring-2 ring-current/30")
                : "bg-muted/70 text-muted-foreground hover:text-foreground"
            )}
          >
            {k.label}
            {k.id !== "all" && <span className="text-xs opacity-70">{countKind(k.id)}</span>}
          </button>
        ))}
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium",
              filter === f.id ? "border-foreground bg-foreground text-background" : "bg-background"
            )}
          >
            {f.label}
            {f.id !== "all" && <span className="text-xs opacity-60">{count(f.id)}</span>}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.length === 0 && <Empty>Aucune réservation ici.</Empty>}
        {visible.map((lead) => {
          const type = leadKind(lead.offer);
          const yearly = subscriptionPrice(lead.offer);
          const price = priceOf(lead.offer);
          return (
            <article key={lead.id} className={cn("flex flex-col rounded-2xl border bg-card p-5", lead.status === "new" && "ring-2 ring-primary/30")}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Pill className={cn("mb-1.5", leadKindStyle[type])}>{leadKindLabel[type]}</Pill>
                  <p className="text-lg font-semibold">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{dateFormatter.format(new Date(lead.created_at))}</p>
                </div>
                <Pill className={leadStatusStyle[lead.status]}>{leadStatusLabel[lead.status]}</Pill>
              </div>

              {lead.offer && (
                <p className="mt-3 text-sm">
                  {type === "service" ? "Service" : type === "subscription" ? "Formule" : "Offre"}{" "}
                  <strong>{lead.offer.replace(/^Service : /, "")}</strong>
                  {yearly != null
                    ? ` · ${formatDA(yearly)} par an`
                    : price != null
                      ? ` · ${formatDA(price)} (acompte ${formatDA(Math.round(price / 2))})`
                      : " · sur devis"}
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {lead.phone}
                </span>
                {lead.email && (
                  <span className="flex items-center gap-1.5 break-all">
                    <Mail className="size-3.5" />
                    {lead.email}
                  </span>
                )}
              </div>
              {lead.message && <p className="mt-3 rounded-xl bg-muted/60 p-3 text-sm whitespace-pre-line">{lead.message}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
                <WhatsAppButton phone={lead.phone} text={`Bonjour ${lead.name}, c'est NUVEX suite à votre réservation${lead.offer ? ` (offre ${lead.offer})` : ""}.`} />
                <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className="inline-flex h-7 items-center gap-1 rounded-lg border px-2.5 text-[0.8rem] font-medium">
                  <PhoneCall className="size-3.5" />
                  Appeler
                </a>
                {lead.status === "new" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(lead, "contacted")}>
                    Marquer contactée
                  </Button>
                )}
                {lead.status === "converted" ? (
                  <Button size="sm" variant="outline" onClick={onOpenProjects}>
                    Voir le projet
                  </Button>
                ) : (
                  lead.status !== "cancelled" && (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() =>
                        setConverting({ name: lead.name, phone: lead.phone, email: lead.email, offer: lead.offer, lead_id: lead.id, notes: lead.message })
                      }
                    >
                      <CheckCircle2 />
                      Confirmer → projet
                    </Button>
                  )
                )}
                <div className="ml-auto flex gap-1">
                  {lead.status !== "cancelled" && lead.status !== "converted" && (
                    <Button size="icon-sm" variant="ghost" onClick={() => setStatus(lead, "cancelled")} aria-label="Annuler la réservation" title="Annuler">
                      <XCircle />
                    </Button>
                  )}
                  <Button size="icon-sm" variant="ghost" onClick={() => remove(lead)} aria-label="Supprimer" title="Supprimer">
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
        open={converting !== null}
        prefill={converting}
        clients={clients}
        offers={offers}
        onClose={() => setConverting(null)}
        onSaved={() => {
          setConverting(null);
          reload();
        }}
      />
    </div>
  );
}
