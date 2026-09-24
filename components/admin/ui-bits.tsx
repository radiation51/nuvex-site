"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { formatDA, whatsappLink } from "@/lib/format";
import { formatShortDate, paymentMethodLabel } from "@/lib/orders";
import type { PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Pill({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>{children}</span>;
}

/** Tuile de chiffre clé. `tone` colore uniquement l'icône et le bandeau, jamais le texte. */
export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon: React.ElementType;
  tone?: "default" | "good" | "warning" | "critical";
}) {
  const toneClass = {
    default: "bg-primary/10 text-primary",
    good: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    critical: "bg-red-100 text-red-700",
  }[tone];

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("grid size-9 place-items-center rounded-xl", toneClass)}>
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-2 font-heading text-2xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Statut d'un paiement : toujours icône + texte, jamais la couleur seule. */
export function PaymentStatus({
  label,
  amount,
  paidAt,
  method,
  late,
  onPay,
  compact,
}: {
  label: string;
  amount: number;
  paidAt: string | null;
  method?: PaymentMethod | null;
  late?: boolean;
  onPay?: () => void;
  compact?: boolean;
}) {
  if (paidAt) {
    return (
      <div className={cn("flex items-center gap-2 rounded-xl bg-emerald-50 ring-1 ring-emerald-200", compact ? "px-2.5 py-1.5" : "px-3 py-2")}>
        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
        <div className="min-w-0 text-xs leading-tight">
          <p className="font-semibold whitespace-nowrap text-emerald-900">
            {label} {compact ? "·" : "payé ·"} {formatDA(amount)}
          </p>
          <p className="text-emerald-800/80">
            {compact ? "Payé le" : "le"} {formatShortDate(paidAt)}
            {method ? ` · ${paymentMethodLabel[method]}` : ""}
          </p>
        </div>
      </div>
    );
  }

  const Icon = late ? AlertTriangle : Clock;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl ring-1",
        late ? "bg-red-50 ring-red-200" : "bg-amber-50 ring-amber-200",
        compact ? "px-2.5 py-1.5" : "px-3 py-2"
      )}
    >
      <Icon className={cn("size-4 shrink-0", late ? "text-red-600" : "text-amber-600")} />
      <div className="flex-1 text-xs leading-tight">
        <p className={cn("font-semibold whitespace-nowrap", late ? "text-red-900" : "text-amber-900")}>
          {label} {compact ? "·" : "en attente ·"} {formatDA(amount)}
        </p>
        <p className={late ? "text-red-800/80" : "text-amber-800/80"}>
          {compact ? (late ? "À encaisser" : "En attente") : late ? "Projet livré, à encaisser" : "Pas encore reçu"}
        </p>
      </div>
      {onPay && (
        <button
          type="button"
          onClick={onPay}
          className="ml-auto shrink-0 rounded-lg bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background transition-opacity hover:opacity-85"
        >
          Marquer payé
        </button>
      )}
    </div>
  );
}

export function WhatsAppButton({ phone, text, label = "WhatsApp" }: { phone: string; text?: string; label?: string }) {
  if (!phone) return null;
  return (
    <a
      href={whatsappLink(phone, text)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-7 items-center gap-1 rounded-lg bg-[#25D366] px-2.5 text-[0.8rem] font-medium text-ink transition-opacity hover:opacity-90"
    >
      <MessageCircle className="size-3.5" />
      {label}
    </a>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed bg-card/60 p-8 text-center text-sm text-muted-foreground">{children}</p>;
}

export function Loading() {
  return <p className="text-sm text-muted-foreground">Chargement…</p>;
}
