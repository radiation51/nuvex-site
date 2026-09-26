// Type d'une demande reçue, déduit de ce que le client a choisi dans le formulaire.
// Sert au classement dans l'admin (Réservations) et aux notifications Telegram.
import { fr } from "@/lib/i18n/dictionaries/fr";

export type LeadKind = "order" | "quote" | "subscription" | "service";

/**
 * - une offre précise choisie (Éco, Pro, Logiciel Pro…) → commande ;
 * - rien choisi, ou une offre « Sur-mesure » → demande de devis ;
 * - une formule de la page Services (« Suivi … ») → abonnement ;
 * - un service à la carte (« Service : … ») → demande de service.
 */
export function leadKind(offer: string | null | undefined): LeadKind {
  const value = offer?.trim() ?? "";
  if (!value) return "quote";
  if (value.startsWith("Suivi ")) return "subscription";
  if (value.startsWith("Service")) return "service";
  if (/sur-mesure/i.test(value)) return "quote";
  return "order";
}

export const leadKindLabel: Record<LeadKind, string> = {
  order: "Commande",
  quote: "Devis",
  subscription: "Abonnement",
  service: "Service",
};

/** Titre de la notification (« Nouvelle commande »…). */
export const leadKindTitle: Record<LeadKind, string> = {
  order: "Nouvelle commande",
  quote: "Nouvelle demande de devis",
  subscription: "Nouvel abonnement",
  service: "Nouvelle demande de service",
};

export const leadKindEmoji: Record<LeadKind, string> = {
  order: "🛒",
  quote: "📋",
  subscription: "🔁",
  service: "🛠️",
};

/** Prix annuel d'une formule de suivi (« Suivi Confort » → 12000), sinon null. */
export function subscriptionPrice(offer: string | null | undefined) {
  return fr.services.plans.find((p) => `Suivi ${p.name}` === offer?.trim())?.price ?? null;
}

/** Couleurs de l'étiquette dans l'admin. */
export const leadKindStyle: Record<LeadKind, string> = {
  order: "bg-emerald-100 text-emerald-800",
  quote: "bg-sky-100 text-sky-800",
  subscription: "bg-violet-100 text-violet-800",
  service: "bg-amber-100 text-amber-800",
};
