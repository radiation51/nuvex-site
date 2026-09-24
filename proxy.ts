import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminToken, readAdminPassword, readAdminPath, safeEqual } from "@/lib/admin-auth";

// L'admin n'est accessible que par son adresse secrète (variable ADMIN_PATH), puis par mot de passe.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const notFound = () => NextResponse.rewrite(new URL("/page-introuvable", request.url));

  // Les vraies pages de l'admin ne sont jamais accessibles directement.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return notFound();

  const entry = readAdminPath();
  const isEntry = entry !== "" && (pathname === entry || pathname.startsWith(`${entry}/`));
  if (!isEntry) return NextResponse.next();

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
  // Toutes les pages (l'adresse secrète n'est connue qu'au moment de la requête), sauf fichiers et API.
  matcher: ["/((?!_next/|api/|.*\\.[A-Za-z0-9]+$).*)"],
};
