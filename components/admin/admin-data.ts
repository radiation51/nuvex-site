"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useTable } from "@/components/admin/shared";
import { splitOffers } from "@/lib/defaults";
import type { Client, Lead, Offer, Order, Review } from "@/lib/types";

export interface AdminData {
  orders: Order[];
  clients: Client[];
  leads: Lead[];
  offers: Offer[];
  reviews: Review[];
  clientById: Map<string, Client>;
  reload: () => Promise<void>;
}

/** Charge en une fois les données de gestion (réservations, clients, projets, avis). */
export function useAdminData(supabase: SupabaseClient): AdminData | null {
  const [orders, reloadOrders] = useTable<Order>(supabase, "orders");
  const [clients, reloadClients] = useTable<Client>(supabase, "clients", "name", true);
  const [leads, reloadLeads] = useTable<Lead>(supabase, "leads");
  const [offers, reloadOffers] = useTable<Offer>(supabase, "offers", "position", true);
  const [reviews, reloadReviews] = useTable<Review>(supabase, "reviews");

  const reload = React.useCallback(async () => {
    await Promise.all([reloadOrders(), reloadClients(), reloadLeads(), reloadOffers(), reloadReviews()]);
  }, [reloadOrders, reloadClients, reloadLeads, reloadOffers, reloadReviews]);

  const clientById = React.useMemo(() => new Map((clients ?? []).map((c) => [c.id, c])), [clients]);
  // Offres de sites puis de logiciels (valeurs par défaut pour un groupe pas encore enregistré).
  const allOffers = React.useMemo(() => {
    const { offers: sites, softwareOffers } = splitOffers(offers ?? []);
    return [...sites, ...softwareOffers];
  }, [offers]);

  if (!orders || !clients || !leads || !offers || !reviews) return null;
  return { orders, clients, leads, offers: allOffers, reviews, clientById, reload };
}
