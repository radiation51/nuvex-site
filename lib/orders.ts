// Calculs et libellés communs pour les projets clients (acompte 50 % + solde).
import { isSoftwareOffer } from "@/lib/defaults";
import type { LeadStatus, Offer, Order, OrderStatus, PaymentMethod } from "@/lib/types";

export const DEFAULT_DEPOSIT_PERCENT = 50;
export const DEFAULT_DELIVERY_DAYS = 7;
export const SOFTWARE_DELIVERY_DAYS = 21;

/** Délai de livraison prévu pour une offre : 7 jours pour un site, 21 jours pour un logiciel. */
export const deliveryDaysFor = (offer?: Pick<Offer, "id">) =>
  offer && isSoftwareOffer(offer) ? SOFTWARE_DELIVERY_DAYS : DEFAULT_DELIVERY_DAYS;

/** Nom proposé pour un nouveau projet selon l'offre choisie. */
export function defaultOrderTitle(offer?: Pick<Offer, "id" | "name">) {
  if (!offer) return "Site web";
  return isSoftwareOffer(offer)
    ? `Logiciel — offre ${offer.name.replace(/^Logiciel\s+/i, "")}`
    : `Site web — offre ${offer.name}`;
}

export const depositAmount = (o: Pick<Order, "price" | "deposit_percent">) =>
  Math.round((o.price * o.deposit_percent) / 100);

export const balanceAmount = (o: Pick<Order, "price" | "deposit_percent">) => o.price - depositAmount(o);

export const paidAmount = (o: Order) =>
  (o.deposit_paid_at ? depositAmount(o) : 0) + (o.balance_paid_at ? balanceAmount(o) : 0);

export const remainingAmount = (o: Order) => (o.status === "cancelled" ? 0 : o.price - paidAmount(o));

/** Acompte encore dû (projet actif, pas encore payé). */
export const depositDue = (o: Order) => o.status !== "cancelled" && !o.deposit_paid_at && o.price > 0;

/** Solde encore dû (acompte payé, solde non payé). */
export const balanceDue = (o: Order) => o.status !== "cancelled" && !o.balance_paid_at && balanceAmount(o) > 0;

// ---------- Dates (format AAAA-MM-JJ, heure locale) ----------

export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const todayISO = () => toISODate(new Date());

export function parseISODate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number) {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** Nombre de jours entre aujourd'hui et la date (négatif = dépassée). */
export function daysUntil(iso: string) {
  const ms = parseISODate(iso).getTime() - parseISODate(todayISO()).getTime();
  return Math.round(ms / 86_400_000);
}

export const isLate = (o: Order) =>
  (o.status === "todo" || o.status === "in_progress") && !!o.due_date && daysUntil(o.due_date) < 0;

const shortDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
const longDate = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

export const formatShortDate = (iso: string) => shortDate.format(parseISODate(iso));
export const formatLongDate = (iso: string) => longDate.format(parseISODate(iso));

/** « Aujourd'hui », « Demain », « Dans 3 j », « En retard de 2 j » */
export function relativeDay(iso: string) {
  const n = daysUntil(iso);
  if (n === 0) return "Aujourd'hui";
  if (n === 1) return "Demain";
  if (n === -1) return "Hier";
  return n > 0 ? `Dans ${n} j` : `Il y a ${-n} j`;
}

// ---------- Libellés ----------

export const orderStatusLabel: Record<OrderStatus, string> = {
  todo: "À démarrer",
  in_progress: "En cours",
  delivered: "Livré",
  cancelled: "Annulé",
};

export const orderStatusStyle: Record<OrderStatus, string> = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-primary/10 text-primary",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export const leadStatusLabel: Record<LeadStatus, string> = {
  new: "Nouvelle",
  contacted: "Contactée",
  converted: "Confirmée",
  cancelled: "Annulée",
};

export const leadStatusStyle: Record<LeadStatus, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-amber-100 text-amber-800",
  converted: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-100 text-slate-600",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  especes: "Espèces",
  ccp: "CCP",
  baridimob: "BaridiMob",
  virement: "Virement",
  autre: "Autre",
};
