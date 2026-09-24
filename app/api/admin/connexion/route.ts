import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, adminToken, readAdminPassword, safeEqual } from "@/lib/admin-auth";
import { blockedFor, clearFailures, formatDuration, registerFailure } from "@/lib/login-guard";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Vérifie le mot de passe admin et ouvre la session (cookie sécurisé). */
export async function POST(request: Request) {
  const ip = clientIp(request);

  // Filet de sécurité immédiat contre les rafales de requêtes.
  if (isRateLimited(`admin-login:${ip}`, 15, 60 * 1000)) {
    return Response.json({ error: "Trop d'essais. Réessayez plus tard." }, { status: 429 });
  }

  // IP bloquée après trop d'erreurs : même le bon mot de passe est refusé.
  const blocked = await blockedFor(ip);
  if (blocked) {
    return Response.json({ error: `Accès bloqué après trop d'essais. Réessayez dans ${formatDuration(blocked)}.` }, { status: 429 });
  }

  const expected = readAdminPassword();
  if (!expected) {
    return Response.json({ error: "Le mot de passe admin n'est pas encore configuré sur le serveur." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const given = String(body?.password ?? "");

  if (!safeEqual(await adminToken(given), await adminToken(expected))) {
    await wait(800); // ralentit les robots
    const { blockedMs, remaining } = await registerFailure(ip);
    if (blockedMs) {
      return Response.json({ error: `Trop d'essais : accès bloqué pendant ${formatDuration(blockedMs)}.` }, { status: 429 });
    }
    return Response.json(
      { error: `Mot de passe incorrect. Encore ${remaining} essai${remaining > 1 ? "s" : ""} avant blocage.` },
      { status: 401 }
    );
  }

  await clearFailures(ip);
  (await cookies()).set(ADMIN_COOKIE, await adminToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return Response.json({ ok: true });
}

/** Déconnexion : supprime le cookie. */
export async function DELETE() {
  (await cookies()).delete(ADMIN_COOKIE);
  return Response.json({ ok: true });
}
