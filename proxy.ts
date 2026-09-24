import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminToken, readAdminPassword, safeEqual } from "@/lib/admin-auth";

// Protège tout /admin par mot de passe (vérifié côté serveur, avant d'afficher la page).
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/connexion")) return NextResponse.next();

  const password = readAdminPassword();
  if (!password) {
    // En local, sans mot de passe défini : accès libre pour travailler.
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/connexion?erreur=config", request.url));
  }

  const cookie = request.cookies.get(ADMIN_COOKIE)?.value ?? "";
  if (cookie && safeEqual(cookie, await adminToken(password))) return NextResponse.next();

  return NextResponse.redirect(new URL("/admin/connexion", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
