import { ADMIN_COOKIE, readAdminPassword } from "@/lib/admin-auth";
import { VISIT_KINDS, type TrackPayload } from "@/lib/analytics";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { getServiceSupabase } from "@/lib/supabase-admin";

// Mesure d'audience anonyme : aucune adresse IP ni cookie n'est enregistré.
// Le visiteur est reconnu pendant une journée seulement, par une empreinte qui change chaque jour.

const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp\/|headless|lighthouse|pingdom|monitor|curl|wget|python/i;
const LANGS = ["fr", "en", "ar"];

/** Provenance lisible : Google, Instagram, WhatsApp… ou « Direct ». */
function sourceOf(referrer: string, utm: string) {
  const text = `${utm} ${referrer}`.toLowerCase();
  const known: [RegExp, string][] = [
    [/google/, "Google"],
    [/instagram|ig\b/, "Instagram"],
    [/facebook|fb\.|\bfb\b|messenger/, "Facebook"],
    [/whatsapp|wa\.me/, "WhatsApp"],
    [/tiktok/, "TikTok"],
    [/linkedin|lnkd/, "LinkedIn"],
    [/bing/, "Bing"],
    [/youtube|youtu\.be/, "YouTube"],
    [/snapchat/, "Snapchat"],
  ];
  for (const [pattern, name] of known) if (pattern.test(text)) return name;
  if (utm) return utm.slice(0, 40);
  if (!referrer) return "Direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "").slice(0, 60);
  } catch {
    return "Autre site";
  }
}

function deviceOf(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

async function dailyVisitorId(ip: string, ua: string) {
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.ANALYTICS_SALT || readAdminPassword() || "nuvex";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}|${day}|${ip}|${ua}`));
  return Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const done = () => new Response(null, { status: 204 });
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOTS.test(ua)) return done();

  // Les visites de l'administrateur (connecté à l'admin) ne sont pas comptées.
  if (request.headers.get("cookie")?.includes(`${ADMIN_COOKIE}=`)) return done();

  const ip = clientIp(request);
  if (isRateLimited(`track:${ip}`, 120, 60_000)) return done();

  const body = (await request.json().catch(() => null)) as Partial<TrackPayload> | null;
  if (!body || !(VISIT_KINDS as readonly string[]).includes(body.kind ?? "")) return done();

  const supabase = getServiceSupabase();
  if (!supabase) return done();

  const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");
  const path = text(body.path, 200) || "/";
  if (!path.startsWith("/")) return done();

  await supabase.from("visits").insert({
    kind: body.kind,
    path,
    lang: LANGS.includes(body.lang ?? "") ? body.lang : "fr",
    source: body.kind === "view" ? sourceOf(text(body.referrer, 300), text(body.utm, 40)) : null,
    device: deviceOf(ua),
    country: text(request.headers.get("x-country"), 2).toUpperCase() || null,
    visitor: await dailyVisitorId(ip, ua),
    label: text(body.label, 80) || null,
  });

  return done();
}
