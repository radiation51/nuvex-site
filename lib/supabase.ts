import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Site en ligne sans base de données : les formulaires envoient leur contenu sur WhatsApp
 * (rien n'est perdu). Redevient automatique dès que Supabase est branché.
 */
export const formsViaWhatsApp = !isSupabaseConfigured && process.env.NODE_ENV === "production";

let browserClient: SupabaseClient | null = null;

/** Client côté navigateur (admin). Garde la session de connexion. */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  browserClient ??= createClient(url!, anonKey!);
  return browserClient;
}

/** Client côté serveur, sans session (lecture publique, envois de formulaires). */
export function getServerSupabase(accessToken?: string): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(url!, anonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}
