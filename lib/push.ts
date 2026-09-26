import "server-only";
import webpush, { type PushSubscription } from "web-push";
import { readAdminPath } from "@/lib/admin-auth";
import { defaultOffers, defaultSoftwareOffers } from "@/lib/defaults";
import { formatDA, whatsappLink } from "@/lib/format";
import { leadKind, leadKindEmoji, leadKindTitle } from "@/lib/lead-kind";
import { getServicesContent } from "@/lib/services";
import { getServiceSupabase } from "@/lib/supabase-admin";

// Notifications sur le téléphone, envoyées par le navigateur lui-même (comme Instagram ou WhatsApp),
// vers les appareils où l'admin a activé les notifications (Admin > Paramètres).
// Les clés d'envoi (« VAPID ») sont créées automatiquement et gardées dans la table « notify » :
// rien à configurer sur Netlify. Sans base de données (en local), tout reste en mémoire.

interface Vapid {
  publicKey: string;
  privateKey: string;
}

export interface StoredSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
  device?: string | null;
}

export interface PushPayload {
  title: string;
  body: string;
  /** Page ouverte au toucher de la notification. */
  url?: string;
  /** Bouton « Répondre sur WhatsApp ». */
  whatsapp?: string;
  tag?: string;
}

const memory: { vapid?: Vapid; subs: Map<string, StoredSubscription> } = { subs: new Map() };

async function getVapid(): Promise<Vapid> {
  const supabase = getServiceSupabase();
  if (!supabase) return (memory.vapid ??= webpush.generateVAPIDKeys());

  const { data } = await supabase.from("notify").select("vapid_public, vapid_private").eq("id", 1).maybeSingle();
  if (data?.vapid_public && data.vapid_private) return { publicKey: data.vapid_public, privateKey: data.vapid_private };

  const keys = webpush.generateVAPIDKeys();
  await supabase.from("notify").upsert({ id: 1, vapid_public: keys.publicKey, vapid_private: keys.privateKey });
  return keys;
}

export async function getPublicKey() {
  return (await getVapid()).publicKey;
}

async function listSubscriptions(): Promise<StoredSubscription[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [...memory.subs.values()];
  const { data } = await supabase.from("push_subscriptions").select("endpoint, p256dh, auth, device");
  return (data as StoredSubscription[] | null) ?? [];
}

export async function countSubscriptions() {
  return (await listSubscriptions()).length;
}

export async function saveSubscription(sub: StoredSubscription) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    memory.subs.set(sub.endpoint, sub);
    return;
  }
  await supabase.from("push_subscriptions").upsert({ ...sub, created_at: new Date().toISOString() });
}

export async function removeSubscription(endpoint: string) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    memory.subs.delete(endpoint);
    return;
  }
  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
}

/** Envoie la notification à tous les appareils activés. Retourne le nombre d'appareils atteints. */
export async function sendPush(payload: PushPayload) {
  const subs = await listSubscriptions();
  if (!subs.length) return 0;
  const vapid = await getVapid();
  webpush.setVapidDetails("mailto:contact@nuvex.dz", vapid.publicKey, vapid.privateKey);

  const body = JSON.stringify({ url: readAdminPath() || "/", ...payload });
  let sent = 0;
  await Promise.all(
    subs.map(async (sub) => {
      const target: PushSubscription = { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } };
      try {
        await webpush.sendNotification(target, body, { TTL: 60 * 60 * 24, urgency: "high", timeout: 5000 });
        sent++;
      } catch (error) {
        // Appareil désinscrit ou notifications désactivées : on l'oublie.
        const status = (error as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) await removeSubscription(sub.endpoint);
      }
    })
  );
  return sent;
}

/** Prix de l'offre choisie, pour l'afficher dans la notification. */
function priceOf(offer: string) {
  const plan = getServicesContent("fr").plans.find((p) => p.value === offer);
  if (plan?.price) return `${formatDA(plan.price)} / an`;
  const found = [...defaultOffers, ...defaultSoftwareOffers].find((o) => o.name === offer);
  return found?.price ? `dès ${formatDA(found.price)}` : "";
}

/** « Nouvelle commande », « Nouvelle demande de devis »… dès qu'une demande arrive du site. */
export async function notifyLead(lead: { name: string; phone: string; offer?: string | null; message?: string | null }) {
  const kind = leadKind(lead.offer);
  const offer = lead.offer?.replace(/^Service : /, "");
  const price = lead.offer ? priceOf(lead.offer) : "";
  const details = [lead.name, offer && `${offer}${price ? ` (${price})` : ""}`, lead.phone].filter(Boolean).join(" · ");
  const hello = `Bonjour ${lead.name.split(/\s+/)[0]}, c'est NUVEX suite à votre demande sur notre site.`;
  await sendPush({
    title: `${leadKindEmoji[kind]} ${leadKindTitle[kind]}`,
    body: lead.message ? `${details}\n« ${lead.message.slice(0, 140)} »` : details,
    whatsapp: whatsappLink(lead.phone, hello),
    tag: `lead-${Date.now()}`,
  }).catch(() => 0);
}

/** « Nouvel avis » à valider dans l'admin. */
export async function notifyReview(review: { name: string; rating: number; text: string }) {
  await sendPush({
    title: "⭐ Nouvel avis à valider",
    body: `${review.name} · ${"★".repeat(review.rating)}\n« ${review.text.slice(0, 140)} »`,
    tag: `review-${Date.now()}`,
  }).catch(() => 0);
}
