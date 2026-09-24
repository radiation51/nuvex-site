import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client « admin » côté serveur : utilise la clé secrète (SUPABASE_SERVICE_ROLE_KEY),
// qui n'est jamais envoyée au navigateur. À n'utiliser qu'après vérification du mot de passe admin.
export function getServiceSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Tables que l'admin a le droit de lire et modifier. */
export const ADMIN_TABLES = ["reviews", "leads", "clients", "orders", "offers", "projects", "settings"] as const;
