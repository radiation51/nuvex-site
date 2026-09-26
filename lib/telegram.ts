import "server-only";
import { defaultOffers, defaultSoftwareOffers } from "@/lib/defaults";
import { formatDA, whatsappLink } from "@/lib/format";
import { leadKind, leadKindEmoji, leadKindTitle } from "@/lib/lead-kind";
import { getServicesContent } from "@/lib/services";
import { getServiceSupabase } from "@/lib/supabase-admin";

// Notifications sur le téléphone via un robot Telegram.
// - TELEGRAM_BOT_TOKEN (variable Netlify) : la clé du robot, donnée par @BotFather.
// - Le « chat » où envoyer les messages est enregistré depuis l'admin (Paramètres > Relier mon Telegram),
//   dans la table « notify ». TELEGRAM_CHAT_ID peut aussi être défini à la main.

type NetlifyGlobal = { Netlify?: { env: { get(key: string): string | undefined } } };
const env = (key: string) => process.env[key] || (globalThis as NetlifyGlobal).Netlify?.env.get(key) || "";

export const telegramToken = () => env("TELEGRAM_BOT_TOKEN").trim();

async function telegram<T = unknown>(method: string, body?: Record<string, unknown>): Promise<T | null> {
  const token = telegramToken();
  if (!token) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: AbortSignal.timeout(5000),
    });
    const json = (await res.json()) as { ok: boolean; result: T };
    return json.ok ? json.result : null;
  } catch {
    return null;
  }
}

export async function getChatId() {
  const fromEnv = env("TELEGRAM_CHAT_ID").trim();
  if (fromEnv) return fromEnv;
  const supabase = getServiceSupabase();
  if (!supabase) return "";
  const { data } = await supabase.from("notify").select("telegram_chat_id").eq("id", 1).maybeSingle();
  return (data?.telegram_chat_id as string | undefined) ?? "";
}

/** Nom du robot (pour l'admin) : null si la clé est absente ou fausse. */
export async function botUsername() {
  const me = await telegram<{ username: string }>("getMe");
  return me?.username ?? null;
}

/** Relie le robot au dernier compte qui lui a écrit (« Démarrer ») et enregistre ce chat. */
export async function linkLatestChat() {
  const updates = await telegram<{ message?: { chat: { id: number; type: string; first_name?: string } } }[]>("getUpdates", {
    limit: 50,
  });
  const chat = [...(updates ?? [])].reverse().find((u) => u.message?.chat.type === "private")?.message?.chat;
  if (!chat) return null;
  const supabase = getServiceSupabase();
  if (supabase) await supabase.from("notify").upsert({ id: 1, telegram_chat_id: String(chat.id), updated_at: new Date().toISOString() });
  return { id: String(chat.id), name: chat.first_name ?? "" };
}

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function sendTelegram(text: string, buttons: { text: string; url: string }[] = [], chatId?: string) {
  const chat = chatId ?? (await getChatId());
  if (!chat) return false;
  const result = await telegram("sendMessage", {
    chat_id: chat,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: buttons.length ? { inline_keyboard: [buttons] } : undefined,
  });
  return Boolean(result);
}

/** Prix de l'offre choisie, pour l'afficher dans la notification. */
function priceOf(offer: string) {
  const plan = getServicesContent("fr").plans.find((p) => p.value === offer);
  if (plan?.price) return `${formatDA(plan.price)} / an`;
  const found = [...defaultOffers, ...defaultSoftwareOffers].find((o) => o.name === offer);
  return found?.price ? `à partir de ${formatDA(found.price)}` : "";
}

/** « Nouvelle commande », « Nouvelle demande de devis »… envoyée quand une demande arrive du site. */
export async function notifyLead(lead: { name: string; phone: string; email?: string | null; offer?: string | null; message?: string | null }) {
  if (!telegramToken()) return;
  const kind = leadKind(lead.offer);
  const price = lead.offer ? priceOf(lead.offer) : "";
  const lines = [
    `${leadKindEmoji[kind]} <b>${leadKindTitle[kind]}</b>`,
    "",
    `👤 <b>${escape(lead.name)}</b>`,
    `📞 ${escape(lead.phone)}`,
    lead.email ? `✉️ ${escape(lead.email)}` : "",
    lead.offer ? `💼 ${escape(lead.offer.replace(/^Service : /, ""))}${price ? ` · ${escape(price)}` : ""}` : "💼 Offre : pas encore choisie",
    lead.message ? `\n📝 ${escape(lead.message.slice(0, 700))}` : "",
  ].filter((line) => line !== "");
  const hello = `Bonjour ${lead.name.split(/\s+/)[0]}, c'est NUVEX suite à votre demande sur notre site.`;
  await sendTelegram(lines.join("\n"), [{ text: "💬 Répondre sur WhatsApp", url: whatsappLink(lead.phone, hello) }]);
}

/** « Nouvel avis » à valider dans l'admin. */
export async function notifyReview(review: { name: string; role?: string | null; rating: number; text: string }) {
  if (!telegramToken()) return;
  const lines = [
    "⭐ <b>Nouvel avis à valider</b>",
    "",
    `👤 <b>${escape(review.name)}</b>${review.role ? ` · ${escape(review.role)}` : ""}`,
    `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`,
    `📝 ${escape(review.text.slice(0, 600))}`,
    "",
    "À valider dans l'admin, rubrique Avis.",
  ];
  await sendTelegram(lines.join("\n"));
}
