// Limite simple en mémoire : suffisant contre les envois répétés d'un même visiteur.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export function clientIp(request: Request) {
  // Sur Netlify, « x-nf-client-connection-ip » donne l'IP réelle du visiteur (impossible à falsifier).
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local"
  );
}
