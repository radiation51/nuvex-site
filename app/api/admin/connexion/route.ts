import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, adminToken, readAdminPassword, safeEqual } from "@/lib/admin-auth";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

/** Vérifie le mot de passe admin et ouvre la session (cookie sécurisé). */
export async function POST(request: Request) {
  if (isRateLimited(`admin-login:${clientIp(request)}`, 8, 15 * 60 * 1000)) {
    return Response.json({ error: "Trop d'essais. Réessayez dans 15 minutes." }, { status: 429 });
  }

  const expected = readAdminPassword();
  if (!expected) {
    return Response.json({ error: "Le mot de passe admin n'est pas encore configuré sur le serveur." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const given = String(body?.password ?? "");
  if (!safeEqual(await adminToken(given), await adminToken(expected))) {
    return Response.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

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
