import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_ENTRY_PATH, adminToken, readAdminPassword, safeEqual } from "@/lib/admin-auth";

// L'admin n'est accessible que par son adresse secrète, puis par mot de passe (vérifié côté serveur).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Accès direct à /admin : on fait comme si la page n'existait pas.
  if (!pathname.startsWith(ADMIN_ENTRY_PATH)) {
    return NextResponse.rewrite(new URL("/page-introuvable", request.url));
  }

  const password = readAdminPassword();
  if (!password) {
    // En local, sans mot de passe défini : accès libre pour travailler.
    if (process.env.NODE_ENV !== "production") return NextResponse.rewrite(new URL("/admin", request.url));
    return NextResponse.rewrite(new URL("/admin/connexion?erreur=config", request.url));
  }

  const cookie = request.cookies.get(ADMIN_COOKIE)?.value ?? "";
  const loggedIn = cookie !== "" && safeEqual(cookie, await adminToken(password));
  return NextResponse.rewrite(new URL(loggedIn ? "/admin" : "/admin/connexion", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/espace-nuvex-618b088f", "/espace-nuvex-618b088f/:path*"],
};
