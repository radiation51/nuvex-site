// Mot de passe de l'espace admin : défini dans la variable d'environnement ADMIN_PASSWORD ou ADMINPASSWORDNUVEX
// (Netlify > Project configuration > Environment variables). Jamais écrit dans le code.

type NetlifyGlobal = { Netlify?: { env: { get(key: string): string | undefined } } };

/**
 * Adresse de l'admin : « /admin » par défaut (protégé par le mot de passe).
 * Une adresse secrète peut être choisie avec la variable d'environnement ADMIN_PATH (ex. « espace-k7p2x9 »).
 */
export function readAdminPath() {
  const raw = (process.env.ADMIN_PATH || (globalThis as NetlifyGlobal).Netlify?.env.get("ADMIN_PATH") || "").trim();
  if (!raw) return "/admin";
  return `/${raw.replace(/^\/+|\/+$/g, "")}`;
}

export const ADMIN_COOKIE = "nuvex_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

// Noms acceptés pour la variable (le 2e est celui créé sur Netlify).
const PASSWORD_VARS = ["ADMIN_PASSWORD", "ADMINPASSWORDNUVEX"] as const;

export function readAdminPassword() {
  const netlify = (globalThis as NetlifyGlobal).Netlify?.env;
  for (const name of PASSWORD_VARS) {
    const value = process.env[name] || netlify?.get(name);
    if (value) return value;
  }
  return "";
}

/** Jeton stocké dans le cookie : empreinte du mot de passe (le mot de passe lui-même n'est jamais stocké). */
export async function adminToken(password: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode("nuvex-admin-v1"));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Vrai si la requête porte un cookie de session admin valide (en local sans mot de passe : toujours vrai). */
export async function isAdminRequest(request: Request) {
  const password = readAdminPassword();
  if (!password) return process.env.NODE_ENV !== "production";
  const cookie = request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`))?.[1] ?? "";
  return cookie !== "" && safeEqual(cookie, await adminToken(password));
}

/** Comparaison à durée constante. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
