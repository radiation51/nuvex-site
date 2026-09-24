import "server-only";

// Anti-spam de la connexion admin : après trop d'erreurs, l'adresse IP est bloquée
// (1 h, puis 24 h, puis 7 jours). Le compteur est gardé dans Netlify Blobs pour survivre
// aux redémarrages des serveurs ; en local, il est gardé en mémoire.

const WINDOW_MS = 15 * 60 * 1000; // erreurs comptées sur 15 minutes
export const MAX_FAILS = 5;
const BLOCK_STEPS_MS = [60 * 60 * 1000, 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000];

interface GuardRecord {
  fails: number[];
  blockedUntil: number;
  strikes: number;
}

type BlobStore = {
  get(key: string, options: { type: "json" }): Promise<unknown>;
  setJSON(key: string, data: unknown): Promise<unknown>;
  delete(key: string): Promise<void>;
};

const memory = new Map<string, GuardRecord>();

async function blobStore(): Promise<BlobStore | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore({ name: "admin-security", consistency: "strong" }) as unknown as BlobStore;
  } catch {
    return null; // hors Netlify (ordinateur local)
  }
}

/** On ne garde pas l'IP en clair : seulement son empreinte. */
async function keyFor(ip: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`nuvex:${ip}`));
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

async function load(ip: string) {
  const key = await keyFor(ip);
  const store = await blobStore();
  let rec: GuardRecord | null = null;
  if (store) {
    try {
      rec = (await store.get(key, { type: "json" })) as GuardRecord | null;
    } catch {
      rec = memory.get(key) ?? null;
    }
  } else {
    rec = memory.get(key) ?? null;
  }
  return { key, store, rec: rec ?? { fails: [], blockedUntil: 0, strikes: 0 } };
}

async function save(key: string, store: BlobStore | null, rec: GuardRecord) {
  memory.set(key, rec);
  if (store) await store.setJSON(key, rec).catch(() => {});
}

/** Temps de blocage restant (ms), 0 si l'IP peut essayer. */
export async function blockedFor(ip: string) {
  const { rec } = await load(ip);
  return Math.max(0, rec.blockedUntil - Date.now());
}

/** Enregistre une erreur. Renvoie la durée de blocage si le seuil est atteint, sinon les essais restants. */
export async function registerFailure(ip: string): Promise<{ blockedMs: number; remaining: number }> {
  const { key, store, rec } = await load(ip);
  const now = Date.now();
  rec.fails = [...rec.fails.filter((t) => now - t < WINDOW_MS), now];

  if (rec.fails.length >= MAX_FAILS) {
    const blockedMs = BLOCK_STEPS_MS[Math.min(rec.strikes, BLOCK_STEPS_MS.length - 1)];
    rec.strikes += 1;
    rec.blockedUntil = now + blockedMs;
    rec.fails = [];
    await save(key, store, rec);
    return { blockedMs, remaining: 0 };
  }

  await save(key, store, rec);
  return { blockedMs: 0, remaining: MAX_FAILS - rec.fails.length };
}

/** Connexion réussie : on efface les erreurs (le niveau de récidive est gardé). */
export async function clearFailures(ip: string) {
  const { key, store, rec } = await load(ip);
  if (!rec.fails.length && !rec.blockedUntil) return;
  await save(key, store, { fails: [], blockedUntil: 0, strikes: rec.strikes });
}

/** 3 600 000 → « 1 heure » */
export function formatDuration(ms: number) {
  const minutes = Math.ceil(ms / 60000);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `${hours} heure${hours > 1 ? "s" : ""}`;
  const days = Math.ceil(hours / 24);
  return `${days} jour${days > 1 ? "s" : ""}`;
}
