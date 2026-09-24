// Mot de passe de l'espace /admin : défini dans la variable d'environnement ADMIN_PASSWORD
// (Netlify > Project configuration > Environment variables). Jamais écrit dans le code.

/** Adresse secrète de l'admin (à garder pour vous). /admin affiche « page introuvable ».
 *  Si vous la changez, changez aussi les deux lignes du `matcher` dans proxy.ts. */
export const ADMIN_ENTRY_PATH = "/espace-nuvex-618b088f";

export const ADMIN_COOKIE = "nuvex_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

type NetlifyGlobal = { Netlify?: { env: { get(key: string): string | undefined } } };

export function readAdminPassword() {
  return process.env.ADMIN_PASSWORD || (globalThis as NetlifyGlobal).Netlify?.env.get("ADMIN_PASSWORD") || "";
}

/** Jeton stocké dans le cookie : empreinte du mot de passe (le mot de passe lui-même n'est jamais stocké). */
export async function adminToken(password: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode("nuvex-admin-v1"));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Comparaison à durée constante. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
