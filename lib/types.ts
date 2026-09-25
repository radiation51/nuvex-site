export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  /** Prix en DA. `null` = sur devis. */
  price: number | null;
  delivery: string;
  features: PlanFeature[];
  popular: boolean;
  position: number;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  image_url: string | null;
  status: ReviewStatus;
  created_at: string;
}

/** Réservation (demande envoyée depuis le site). */
export type LeadStatus = "new" | "contacted" | "converted" | "cancelled";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  offer: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  city: string | null;
  notes: string | null;
  created_at: string;
}

export type OrderStatus = "todo" | "in_progress" | "delivered" | "cancelled";

export type PaymentMethod = "especes" | "ccp" | "baridimob" | "virement" | "autre";

/** Projet client (commande) : suivi de la création, de la livraison et des paiements. */
export interface Order {
  id: string;
  client_id: string;
  lead_id: string | null;
  title: string;
  offer: string | null;
  /** Prix total en DA. */
  price: number;
  /** Pourcentage d'acompte demandé au démarrage (50 par défaut). */
  deposit_percent: number;
  deposit_paid_at: string | null;
  deposit_method: PaymentMethod | null;
  balance_paid_at: string | null;
  balance_method: PaymentMethod | null;
  status: OrderStatus;
  /** Dates au format AAAA-MM-JJ. */
  start_date: string | null;
  due_date: string | null;
  delivered_at: string | null;
  notes: string | null;
  created_at: string;
}

/** Réalisation affichée sur le site (portfolio). */
export interface Project {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  image_url: string;
  link: string | null;
  position: number;
}

export interface Settings {
  whatsapp: string;
  phone: string;
  email: string;
  city: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
}

export interface SiteData {
  /** Offres de sites web. */
  offers: Offer[];
  /** Offres de logiciels (identifiants « logiciel-… »). */
  softwareOffers: Offer[];
  reviews: Review[];
  projects: Project[];
  settings: Settings;
}
